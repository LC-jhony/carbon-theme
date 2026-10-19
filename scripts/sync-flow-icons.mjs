#!/usr/bin/env node
// Copies the Flow Icons palette JSONs and their SVG folders from the locally
// installed thang-nm.flow-icons extension into file-icons/.
//
//   node scripts/sync-flow-icons.mjs           # copy JSONs, refresh folders
//   node scripts/sync-flow-icons.mjs --check   # verify everything matches the source
//
// Every palette JSON is copied twice: to file-icons/<palette>.json (the file
// VS Code loads) and to file-icons/source/<palette>.json (the pristine twin
// the extension regenerates from when the display options change).
//
// Set FLOW_ICONS_DIR to point at another Flow Icons installation. Flow Icons is
// a paid extension; the copied assets are for local use only and must not be
// redistributed.

import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DEST = join(ROOT, "file-icons");
const SOURCE = join(DEST, "source");
const PALETTES = ["dawn", "deep", "dim", "you"];
const CHECK = process.argv.includes("--check");

function compareVersions(a, b) {
	const toParts = (name) =>
		name
			.replace(/^thang-nm\.flow-icons-/, "")
			.split(".")
			.map((part) => Number.parseInt(part, 10) || 0);
	const partsA = toParts(a);
	const partsB = toParts(b);
	for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
		const diff = (partsA[i] ?? 0) - (partsB[i] ?? 0);
		if (diff !== 0) {
			return diff;
		}
	}
	return 0;
}

function findFlowIconsDir() {
	if (process.env.FLOW_ICONS_DIR) {
		return existsSync(process.env.FLOW_ICONS_DIR) ? process.env.FLOW_ICONS_DIR : null;
	}
	const extensionsDir = join(homedir(), ".vscode", "extensions");
	if (!existsSync(extensionsDir)) {
		return null;
	}
	const candidates = readdirSync(extensionsDir)
		.filter((name) => name.startsWith("thang-nm.flow-icons-"))
		.sort(compareVersions);
	if (candidates.length === 0) {
		return null;
	}
	return join(extensionsDir, candidates[candidates.length - 1]);
}

function sameFile(a, b) {
	if (!existsSync(a) || !existsSync(b)) {
		return false;
	}
	if (statSync(a).size !== statSync(b).size) {
		return false;
	}
	return readFileSync(a).equals(readFileSync(b));
}

function sameDir(src, dest) {
	if (!existsSync(dest)) {
		return false;
	}
	const srcFiles = readdirSync(src).sort();
	const destFiles = readdirSync(dest).sort();
	if (srcFiles.length !== destFiles.length) {
		return false;
	}
	return srcFiles.every(
		(name, index) => name === destFiles[index] && sameFile(join(src, name), join(dest, name))
	);
}

const source = findFlowIconsDir();
const errors = [];

if (!source) {
	if (CHECK) {
		console.warn("Flow Icons extension not found; comparing local files only.");
	} else {
		console.error(
			"Flow Icons extension not found. Install thang-nm.flow-icons or set FLOW_ICONS_DIR."
		);
		process.exit(1);
	}
}

for (const palette of PALETTES) {
	const json = `${palette}.json`;
	const folders = [palette, `${palette}-light`];
	const copies = [
		[`file-icons/${json}`, join(DEST, json)],
		[`file-icons/source/${json}`, join(SOURCE, json)],
	];

	if (!CHECK) {
		mkdirSync(SOURCE, { recursive: true });
		for (const [, target] of copies) {
			cpSync(join(source, json), target);
		}
		for (const folder of folders) {
			const dest = join(DEST, folder);
			rmSync(dest, { recursive: true, force: true });
			cpSync(join(source, folder), dest, { recursive: true });
		}
		continue;
	}

	for (const [label, target] of copies) {
		if (!existsSync(target)) {
			errors.push(`missing ${label} (run npm run sync:icons)`);
		} else if (source && !sameFile(join(source, json), target)) {
			errors.push(`${label} differs from the installed Flow Icons copy (run npm run sync:icons)`);
		}
	}

	for (const folder of folders) {
		const dest = join(DEST, folder);
		if (!existsSync(dest)) {
			errors.push(`missing folder file-icons/${folder} (run npm run sync:icons)`);
		} else if (source && !sameDir(join(source, folder), dest)) {
			errors.push(
				`file-icons/${folder} differs from the installed Flow Icons copy (run npm run sync:icons)`
			);
		}
	}
}

if (errors.length > 0) {
	console.error(`flow icons are out of sync (${errors.length} error(s)):`);
	for (const error of errors) {
		console.error(`  - ${error}`);
	}
	process.exit(1);
}

console.log(CHECK ? "flow icons are in sync" : `flow icons synced from ${source}`);
