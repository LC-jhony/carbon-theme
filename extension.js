"use strict";

const fs = require("node:fs");
const path = require("node:path");

const vscode = require("vscode");

/** Every file icon theme this extension contributes starts with this prefix. */
const ICON_PREFIX = "carbon-icons-";

/** File icon palettes, each backed by file-icons/<palette>.json. */
const ICON_PALETTES = ["deep", "dawn", "dim", "you"];

/** Associations removed from every section when folder icons are hidden. */
const FOLDER_ASSOCIATION_KEYS = ["folder", "folderExpanded", "folderNames", "folderNamesExpanded"];

/** Color theme label (lowercase) -> icon and product icon theme ids. */
const THEME_ICON_MAP = {
	"carbon dark": { iconTheme: "carbon-icons-deep", productIconTheme: "carbonSolid" },
	"min dark": { iconTheme: "carbon-icons-deep", productIconTheme: "carbonSolid" },
	"carbon light": { iconTheme: "carbon-icons-dawn", productIconTheme: "carbonOutline" },
	"min light": { iconTheme: "carbon-icons-dawn", productIconTheme: "carbonOutline" },
};

/** Product icon themes owned by this extension. */
const CARBON_PRODUCT_THEMES = new Set(["carbonSolid", "carbonOutline"]);

/**
 * Label of the color theme currently in effect. With OS color scheme
 * auto-detection enabled the effective theme lives in the preferred light/dark
 * settings instead of workbench.colorTheme.
 */
function currentColorThemeLabel() {
	const workbench = vscode.workspace.getConfiguration("workbench");
	let value = workbench.get("colorTheme");

	if (vscode.workspace.getConfiguration("window").get("autoDetectColorScheme", false)) {
		const kind = vscode.window.activeColorTheme.kind;
		const light =
			kind === vscode.ColorThemeKind.Light || kind === vscode.ColorThemeKind.HighContrastLight;
		const preferred = workbench.get(light ? "preferredLightColorTheme" : "preferredDarkColorTheme");
		if (typeof preferred === "string" && preferred.length > 0) {
			value = preferred;
		}
	}

	return typeof value === "string" ? value.trim().toLowerCase() : "";
}

/** Scope where a setting already has a value; new values are written globally. */
function targetScope(config, key) {
	const inspected = config.inspect(key);
	if (inspected) {
		if (inspected.workspaceFolderValue !== undefined) {
			return vscode.ConfigurationTarget.WorkspaceFolder;
		}
		if (inspected.workspaceValue !== undefined) {
			return vscode.ConfigurationTarget.Workspace;
		}
	}
	return vscode.ConfigurationTarget.Global;
}

/** True when the user set the setting in any scope (relying on defaults is not a choice). */
function isExplicitlySet(config, key) {
	const inspected = config.inspect(key);
	return Boolean(
		inspected &&
			(inspected.globalValue !== undefined ||
				inspected.workspaceValue !== undefined ||
				inspected.workspaceFolderValue !== undefined)
	);
}

function isCarbonIconTheme(value) {
	return typeof value !== "string" || value === "" || value.startsWith(ICON_PREFIX);
}

function isCarbonProductIconTheme(value) {
	return typeof value !== "string" || value === "" || CARBON_PRODUCT_THEMES.has(value);
}

async function setIfNeeded(config, key, value) {
	if (config.get(key) === value) {
		return;
	}
	await config.update(key, value, targetScope(config, key));
}

async function tryUpdate(config, key, value) {
	try {
		await setIfNeeded(config, key, value);
	} catch (err) {
		console.error(`Carbon Theme: could not set ${key}.`, err);
	}
}

/**
 * Applies the matching Carbon icons when the active color theme is one of ours.
 * A color theme the user picked outside this extension is never touched, and a
 * manually chosen icon pack is left alone.
 */
async function applyForActiveTheme() {
	const mapping = THEME_ICON_MAP[currentColorThemeLabel()];
	if (!mapping) {
		return;
	}

	const config = vscode.workspace.getConfiguration();
	const carbon = vscode.workspace.getConfiguration("carbonTheme");

	if (carbon.get("autoApplyIcons", true)) {
		const current = config.get("workbench.iconTheme");
		if (!isExplicitlySet(config, "workbench.iconTheme") || isCarbonIconTheme(current)) {
			await tryUpdate(config, "workbench.iconTheme", mapping.iconTheme);
		}
	}

	if (carbon.get("autoApplyProductIcons", true)) {
		const current = config.get("workbench.productIconTheme");
		if (!isExplicitlySet(config, "workbench.productIconTheme") || isCarbonProductIconTheme(current)) {
			await tryUpdate(config, "workbench.productIconTheme", mapping.productIconTheme);
		}
	}
}

/** Options baked into the file-icons/<palette>.json files before VS Code loads them. */
function iconFileOptions() {
	const config = vscode.workspace.getConfiguration("carbonTheme");
	return {
		hidesExplorerArrows: config.get("hidesExplorerArrows", false) === true,
		hidesExplorerFolders: config.get("hidesExplorerFolders", false) === true,
	};
}

/**
 * Builds the theme document for one palette. It starts from the pristine copy
 * in file-icons/source/ so turning an option off restores the original
 * associations instead of keeping a degraded file.
 */
function buildIconThemeJson(source, options) {
	const theme = JSON.parse(source);
	theme.hidesExplorerArrows = options.hidesExplorerArrows;
	if (options.hidesExplorerFolders) {
		for (const section of [theme, theme.light, theme.highContrast]) {
			if (!section) {
				continue;
			}
			for (const key of FOLDER_ASSOCIATION_KEYS) {
				delete section[key];
			}
		}
	}
	return JSON.stringify(theme);
}

/**
 * Regenerates file-icons/<palette>.json for every palette. The icon theme
 * contributions set "_watch", so VS Code reloads the active theme file when it
 * changes on disk; writing only on difference keeps startup flicker-free.
 */
async function syncIconThemes(extensionPath) {
	const options = iconFileOptions();
	const iconsDirectory = path.join(extensionPath, "file-icons");
	const sourcesDirectory = path.join(iconsDirectory, "source");
	if (!fs.existsSync(sourcesDirectory)) {
		console.warn("Carbon Theme: file-icons/source is missing; keeping the shipped icon theme files.");
		return;
	}

	for (const palette of ICON_PALETTES) {
		const targetPath = path.join(iconsDirectory, `${palette}.json`);
		let expected;
		try {
			const source = await fs.promises.readFile(
				path.join(sourcesDirectory, `${palette}.json`),
				"utf8"
			);
			expected = buildIconThemeJson(source, options);
		} catch {
			continue;
		}

		let current = "";
		try {
			current = await fs.promises.readFile(targetPath, "utf8");
		} catch {
			// The target does not exist yet; it is written below.
		}
		if (current === expected) {
			continue;
		}

		const temporaryPath = `${targetPath}.tmp`;
		try {
			await fs.promises.writeFile(temporaryPath, expected);
			await fs.promises.rename(temporaryPath, targetPath);
		} catch (err) {
			await fs.promises.rm(temporaryPath, { force: true }).catch(() => {});
			throw err;
		}
	}
}

function activate(context) {
	const extensionPath = context.extensionUri.fsPath;
	let iconSyncChain = Promise.resolve();
	const queueIconSync = () => {
		iconSyncChain = iconSyncChain
			.then(() => syncIconThemes(extensionPath))
			.catch((err) => {
				console.error("Carbon Theme: could not update the file icon themes.", err);
			});
	};

	void applyForActiveTheme();
	queueIconSync();

	context.subscriptions.push(
		vscode.workspace.onDidChangeConfiguration((event) => {
			if (
				event.affectsConfiguration("workbench.colorTheme") ||
				event.affectsConfiguration("workbench.preferredDarkColorTheme") ||
				event.affectsConfiguration("workbench.preferredLightColorTheme") ||
				event.affectsConfiguration("window.autoDetectColorScheme") ||
				event.affectsConfiguration("carbonTheme.autoApplyIcons") ||
				event.affectsConfiguration("carbonTheme.autoApplyProductIcons")
			) {
				void applyForActiveTheme();
			}
			if (
				event.affectsConfiguration("carbonTheme.hidesExplorerArrows") ||
				event.affectsConfiguration("carbonTheme.hidesExplorerFolders")
			) {
				queueIconSync();
			}
		}),
		vscode.window.onDidChangeActiveColorTheme(() => {
			void applyForActiveTheme();
		})
	);
}

function deactivate() {}

module.exports = { activate, deactivate };
