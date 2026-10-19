#!/usr/bin/env node
// Validates the static parts of the extension: every path referenced from
// package.json exists, every color theme matches its contributed label and
// uiTheme, every icon theme (base, light and highContrast sections) resolves to
// existing SVGs, every icon theme keeps a byte-identical pristine twin under
// file-icons/source/ and declares "_watch" for live reload, the extension icon
// is a square PNG of at least 128x128, the icon/product ids used by
// extension.js are contributed, and every setting used by extension.js is
// declared in package.json.
//
//   node scripts/validate.mjs

import { readFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];

function fail(message) {
  errors.push(message);
}

function readJson(relativePath) {
  const absolutePath = join(ROOT, relativePath);
  if (!existsSync(absolutePath)) {
    fail(`missing file: ${relativePath}`);
    return null;
  }
  try {
    return JSON.parse(readFileSync(absolutePath, "utf8"));
  } catch (err) {
    fail(`invalid JSON in ${relativePath}: ${err.message}`);
    return null;
  }
}

function requireString(object, key, context) {
  const value = object?.[key];
  if (typeof value !== "string" || value.length === 0) {
    fail(`${context}: missing "${key}"`);
    return "";
  }
  return value;
}

function checkUnique(values, context) {
  const seen = new Set();
  for (const value of values) {
    if (seen.has(value)) {
      fail(`${context}: duplicate "${value}"`);
    }
    seen.add(value);
  }
}

function validateColorThemes(pkg) {
  const themes = pkg.contributes?.themes ?? [];
  checkUnique(themes.map((theme) => theme.label), "contributes.themes labels");
  for (const theme of themes) {
    const label = requireString(theme, "label", "contributes.themes entry");
    const path = requireString(theme, "path", `contributes.themes "${label}"`);
    const uiTheme = requireString(theme, "uiTheme", `contributes.themes "${label}"`);
    if (!path) {
      continue;
    }
    if (!existsSync(join(ROOT, path))) {
      fail(`color theme "${label}": missing ${path}`);
      continue;
    }
    const themeJson = readJson(path);
    if (!themeJson) {
      continue;
    }
    if (themeJson.name !== label) {
      fail(`color theme "${label}": name is "${themeJson.name}" in ${path}`);
    }
    const expectedType = { "vs-dark": "dark", vs: "light" }[uiTheme];
    if (expectedType && themeJson.type !== expectedType) {
      fail(`color theme "${label}": type is "${themeJson.type}" but uiTheme is "${uiTheme}"`);
    }
  }
}

const SECTION_KEYS = ["file", "folder", "folderExpanded", "rootFolder", "rootFolderExpanded"];
const SECTION_GROUPS = [
  "fileNames",
  "fileExtensions",
  "languageIds",
  "folderNames",
  "folderNamesExpanded",
];

// Flow Icons emits full "light" and "highContrast" sections whose entries must
// resolve against the shared iconDefinitions map.
function validateIconSection(relativePath, sectionName, section, defined, { required }) {
  if (!section) {
    if (required) {
      fail(`${relativePath}: "${sectionName}" exists but is empty`);
    }
    return;
  }

  const context = sectionName ? `${relativePath}: ${sectionName}.` : `${relativePath}: `;
  for (const key of SECTION_KEYS) {
    const value = section[key];
    if (value === undefined) {
      if (required) {
        fail(`${context}"${key}" does not resolve to a definition`);
      }
      continue;
    }
    if (typeof value !== "string" || !defined.has(value)) {
      fail(`${context}"${key}" points to unknown definition "${value}"`);
    }
  }

  for (const group of SECTION_GROUPS) {
    for (const [key, value] of Object.entries(section[group] ?? {})) {
      if (!defined.has(value)) {
        fail(`${context}${group}.${key} points to unknown definition "${value}"`);
      }
    }
  }
}

function validateIconTheme(relativePath) {
  const theme = readJson(relativePath);
  if (!theme) {
    return;
  }
  const definitions = theme.iconDefinitions ?? {};
  const defined = new Set(Object.keys(definitions));
  if (defined.size === 0) {
    fail(`${relativePath}: no iconDefinitions`);
    return;
  }

  validateIconSection(relativePath, "", theme, defined, { required: true });
  for (const sectionName of ["light", "highContrast"]) {
    validateIconSection(relativePath, sectionName, theme[sectionName], defined, { required: false });
  }

  const baseDir = dirname(join(ROOT, relativePath));
  for (const [id, definition] of Object.entries(definitions)) {
    const iconPath = definition?.iconPath;
    if (typeof iconPath !== "string" || iconPath.length === 0) {
      fail(`${relativePath}: definition "${id}" has no iconPath`);
      continue;
    }
    const absolutePath = resolve(baseDir, iconPath);
    if (!absolutePath.startsWith(join(ROOT, "file-icons"))) {
      fail(`${relativePath}: definition "${id}" escapes file-icons: ${iconPath}`);
      continue;
    }
    if (!existsSync(absolutePath)) {
      fail(`${relativePath}: definition "${id}" points to missing ${iconPath}`);
    }
  }
}

function validateIconThemes(pkg) {
  const iconThemes = pkg.contributes?.iconThemes ?? [];
  if (iconThemes.length === 0) {
    fail("contributes.iconThemes is empty");
  }
  checkUnique(iconThemes.map((theme) => theme.id), "contributes.iconThemes ids");
  checkUnique(iconThemes.map((theme) => theme.label), "contributes.iconThemes labels");
  for (const iconTheme of iconThemes) {
    const id = requireString(iconTheme, "id", "contributes.iconThemes entry");
    const label = requireString(iconTheme, "label", `contributes.iconThemes "${id}"`);
    const path = requireString(iconTheme, "path", `contributes.iconThemes "${id}"`);
    if (!id && !path) {
      continue;
    }
    if (id && !id.startsWith("carbon-icons-")) {
      fail(`contributes.iconThemes "${id}": id must start with "carbon-icons-"`);
      continue;
    }
    const suffix = id.slice("carbon-icons-".length);
    const expectedPath = `./file-icons/${suffix}.json`;
    if (path && path !== expectedPath) {
      fail(`contributes.iconThemes "${id}": path is "${path}" but should be "${expectedPath}"`);
    }
    const expectedLabel = `Carbon Icons ${suffix.charAt(0).toUpperCase()}${suffix.slice(1)}`;
    if (label && label !== expectedLabel) {
      fail(`contributes.iconThemes "${id}": label is "${label}" but should be "${expectedLabel}"`);
    }
    if (path) {
      validateIconTheme(path);

      const sourcePath = `file-icons/source/${suffix}.json`;
      const absoluteSource = join(ROOT, sourcePath);
      const absoluteTarget = join(ROOT, path);
      if (!existsSync(absoluteSource)) {
        fail(`contributes.iconThemes "${id}": missing pristine ${sourcePath}`);
      } else if (
        existsSync(absoluteTarget) &&
        !readFileSync(absoluteSource).equals(readFileSync(absoluteTarget))
      ) {
        fail(
          `contributes.iconThemes "${id}": ${path} differs from ${sourcePath}; ` +
            "run npm run sync:icons to restore it"
        );
      }

      if (iconTheme._watch !== true) {
        fail(`contributes.iconThemes "${id}": missing "_watch": true (required for live reload)`);
      }
    }
  }
}

function validateProductIconThemes(pkg) {
  const productThemes = pkg.contributes?.productIconThemes ?? [];
  checkUnique(productThemes.map((theme) => theme.id), "contributes.productIconThemes ids");
  for (const productTheme of productThemes) {
    const id = requireString(productTheme, "id", "contributes.productIconThemes entry");
    const path = requireString(productTheme, "path", `contributes.productIconThemes "${id}"`);
    if (!path) {
      continue;
    }
    const theme = readJson(path);
    if (!theme) {
      continue;
    }
    const baseDir = dirname(join(ROOT, path));
    for (const font of theme.fonts ?? []) {
      for (const source of font.src ?? []) {
        if (typeof source.path !== "string" || !existsSync(resolve(baseDir, source.path))) {
          fail(`product icon theme "${id}": missing font ${source.path}`);
        }
      }
    }
    if (!theme.iconDefinitions || Object.keys(theme.iconDefinitions).length === 0) {
      fail(`product icon theme "${id}": no iconDefinitions`);
    }
  }
}

function validateMainAndSettings(pkg) {
  const main = pkg.main;
  if (typeof main !== "string" || !existsSync(resolve(ROOT, main))) {
    fail(`main "${main}" does not exist`);
    return;
  }

  const declared = new Set(Object.keys(pkg.contributes?.configuration?.properties ?? {}));
  const source = readFileSync(resolve(ROOT, main), "utf8");
  const used = new Set(source.match(/carbonTheme\.[A-Za-z0-9]+/g) ?? []);
  for (const key of used) {
    if (!declared.has(key)) {
      fail(`${main} uses "${key}" but package.json does not declare it`);
    }
  }

  const iconIds = new Set((pkg.contributes?.iconThemes ?? []).map((theme) => theme.id));
  for (const match of source.matchAll(/iconTheme:\s*"([^"]+)"/g)) {
    if (!iconIds.has(match[1])) {
      fail(`${main} references icon theme "${match[1]}" which package.json does not contribute`);
    }
  }

  const productIds = new Set((pkg.contributes?.productIconThemes ?? []).map((theme) => theme.id));
  for (const match of source.matchAll(/productIconTheme:\s*"([^"]+)"/g)) {
    if (!productIds.has(match[1])) {
      fail(`${main} references product icon theme "${match[1]}" which package.json does not contribute`);
    }
  }
}

function pngDimensions(buffer) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (buffer.length < 24 || !buffer.subarray(0, 8).equals(signature)) {
    return null;
  }
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function validateExtensionIcon(pkg) {
  const icon = pkg.icon;
  if (typeof icon !== "string" || icon.length === 0) {
    fail('package.json: missing "icon" (128x128 PNG shown in the Extensions view)');
    return;
  }
  const absolutePath = resolve(ROOT, icon);
  if (!existsSync(absolutePath)) {
    fail(`package.json: icon file not found: ${icon}`);
    return;
  }
  const dimensions = pngDimensions(readFileSync(absolutePath));
  if (!dimensions) {
    fail(`package.json: icon must be a PNG: ${icon}`);
    return;
  }
  const { width, height } = dimensions;
  if (width !== height || width < 128) {
    fail(
      `package.json: icon should be a square of at least 128x128 (got ${width}x${height}): ${icon}`
    );
  }
}

const pkg = readJson("package.json");
if (pkg) {
  validateColorThemes(pkg);
  validateIconThemes(pkg);
  validateProductIconThemes(pkg);
  validateMainAndSettings(pkg);
  validateExtensionIcon(pkg);
}

if (errors.length > 0) {
  console.error(`invalid extension manifest (${errors.length} error(s)):`);
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exit(1);
}
console.log("extension manifest is valid");
