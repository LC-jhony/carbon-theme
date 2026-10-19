# Referencia

Todo lo que la extensión aporta a VS Code: temas, iconos, ajustes, comandos y
estructura de archivos. Para el uso diario mira el [README](../README.md); para
el flujo de trabajo, [development.md](development.md).

## Temas de color

| Label | `uiTheme` | `type` interno | Archivo |
| --- | --- | --- | --- |
| Carbon Dark | `vs-dark` | `dark` | `themes/carbon-dark.json` |
| Carbon Light | `vs` | `light` | `themes/carbon-light.json` |
| Min Dark | `vs-dark` | `dark` | `themes/min-dark.json` |
| Min Light | `vs` | `light` | `themes/min-light.json` |

Notas:

- El campo `name` dentro de cada JSON debe coincidir con el label de
  `package.json`; `scripts/validate.mjs` lo verifica.
- `themes/min-*.json` son idénticos a `themes/carbon-*.json` salvo el campo
  `name`. Se mantienen como alias con nombre propio para poder activarlos por
  separado (y para el mapeo de auto-aplicación).

## Temas de file icons

| Id | Label | JSON | Carpeta oscura | Carpeta clara |
| --- | --- | --- | --- | --- |
| `carbon-icons-deep` | Carbon Icons Deep | `file-icons/deep.json` | `file-icons/deep/` | `file-icons/deep-light/` |
| `carbon-icons-dawn` | Carbon Icons Dawn | `file-icons/dawn.json` | `file-icons/dawn/` | `file-icons/dawn-light/` |
| `carbon-icons-dim` | Carbon Icons Dim | `file-icons/dim.json` | `file-icons/dim/` | `file-icons/dim-light/` |
| `carbon-icons-you` | Carbon Icons You | `file-icons/you.json` | `file-icons/you/` | `file-icons/you-light/` |

Cada JSON declara:

- **1.904 definiciones** de icono: 952 oscuras + 952 con prefijo `__` para el
  modo claro.
- **739** `fileNames`, **587** `fileExtensions`, **165** `languageIds`,
  **1.263** `folderNames` y **1.263** `folderNamesExpanded`.
- Secciones completas `light` y `highContrast` que reasignan `file`, `folder`,
  `folderExpanded`, `rootFolder`, `rootFolderExpanded` y todos los mapeos a las
  definiciones `__*`.
- `hidesExplorerArrows`: los archivos publicados lo llevan en `false`; el
  ajuste `carbonTheme.hidesExplorerArrows` lo cambia al regenerarlos.

Cada carpeta de paleta contiene **952 SVG**: 230 iconos de archivo y 722 de
carpeta (361 pares `folder_*` + `folder_*_open`).

En el repositorio también existen:

- `file-icons/source/`: copias prístinas de los 4 JSON. La extensión reescribe
  `file-icons/<paleta>.json` desde ellas para aplicar los ajustes de
  visualización; **sí se empaquetan** porque hacen falta en runtime.
- `file-icons/icons/`: el set neutral con el que Flow Icons genera las paletas.
  No se referencia desde ningún tema.
- `file-icons/out/`: código compilado de la extensión Flow Icons.

`file-icons/icons/` y `file-icons/out/` están **excluidas de la VSIX** y no
hacen falta en runtime.

### Archivos generados y `_watch`

Las contribuciones de los icon themes llevan `"_watch": true`, una opción
interna de VS Code (la misma que usa Material Icon Theme): el editor vigila el
archivo del tema de iconos activo y lo recarga en cuanto cambia en disco.
`extension.js` aprovecha eso para aplicar en caliente los ajustes
`carbonTheme.hidesExplorerArrows` y `carbonTheme.hidesExplorerFolders`
reescribiendo `file-icons/<paleta>.json` desde las copias de `source/`. Con los
ajustes en `false` los archivos regenerados quedan byte a byte iguales a las
copias. Detalles en [auto-apply.md](auto-apply.md).

### Formato de los JSON

- Los `iconPath` son rutas **relativas al propio JSON** (por ejemplo
  `./deep/file.svg`), por eso cada JSON vive junto a sus carpetas de paleta en
  `file-icons/`.
- Las parejas oscuro/claro comparten el mapa `iconDefinitions`: el JSON base
  apunta a los SVG de `<paleta>/` y la sección `light` a los de
  `<paleta>-light/` vía las definiciones `__*`.
- `scripts/validate.mjs` comprueba que toda definición resuelve a un SVG
  existente, en las tres secciones (base, `light` y `highContrast`).

## Temas de product icons

| Id | Label | JSON | Fuente | Definiciones |
| --- | --- | --- | --- | --- |
| `carbonSolid` | Carbon Solid | `product-icon/Carbon-Product-Icons-Solid.json` | `assets/carbon-ui-icons-solid.woff2` | 182 |
| `carbonOutline` | Carbon Outline | `product-icon/Carbon-Product-Icons-Outline.json` | `assets/carbon-ui-icons-outline.woff2` | 183 |

Las fuentes se declaran con rutas relativas (`../assets/...`); el validador
comprueba que existan.

## Ajustes

| Ajuste | Tipo | Por defecto | Scope | Efecto |
| --- | --- | --- | --- | --- |
| `carbonTheme.autoApplyIcons` | `boolean` | `true` | `window` | Selecciona el file icon theme que toca (Deep en oscuro, Dawn en claro) al activar un tema Carbon o Min. No pisa elecciones del usuario. |
| `carbonTheme.autoApplyProductIcons` | `boolean` | `true` | `window` | Igual, para el product icon theme (Solid en oscuro, Outline en claro). |
| `carbonTheme.hidesExplorerArrows` | `boolean` | `false` | `window` | Reescribe los temas de iconos con `hidesExplorerArrows: true` para ocultar las flechas del explorador. |
| `carbonTheme.hidesExplorerFolders` | `boolean` | `false` | `window` | Elimina `folder`, `folderExpanded`, `folderNames` y `folderNamesExpanded` de las tres secciones; el root del workspace conserva su icono, igual que en Flow Icons. |

## Comandos

| Comando | Qué hace |
| --- | --- |
| `npm run sync:icons` | Copia los 4 JSON (a `file-icons/` y a `file-icons/source/`) y las 8 carpetas SVG desde la extensión Flow Icons instalada. Falla con un mensaje claro si no la encuentra. |
| `npm run check:icons` | Verifica que las dos copias de cada JSON y las carpetas SVG coinciden byte a byte con la instalación de Flow. Si Flow no está instalada, avisa y comprueba solo lo local. |
| `npm run validate` | Valida el manifiesto: rutas existentes, label/`name`/`type` de los temas, resolución de todos los iconos, coherencia id ↔ ruta ↔ label, gemelos de `source/` idénticos, `_watch: true`, ids usados por `extension.js` contribuidos, ajustes declarados y el icono de la extensión (`icon`, PNG cuadrado de al menos 128×128). |
| `npm run check` | `check:icons` + `validate`. |
| `npm run package` | Corre `check` y empaqueta con `vsce` en `dist/carbon-theme-<versión>.vsix`. |

Variable de entorno:

- `FLOW_ICONS_DIR`: ruta alternativa a una instalación de Flow Icons. Por
  defecto se busca la versión más nueva de `thang-nm.flow-icons-*` en
  `~/.vscode/extensions`.

## Icono de la extensión

`package.json` declara `"icon": "icons/carbon-theme-icon-128.png"` (PNG de
128×128): es el icono que VS Code muestra en la vista de extensiones. La
carpeta `icons/` guarda además el arte original de 256×256
(`carbon-icon-master.png`, el logo que muestra el README) y un `.ico` de 16×16
(`carbon-theme-icon.ico`) que el manifiesto no referencia.

## Estructura del repositorio

```text
carbon-theme/
├─ .vscode/
│  └─ launch.json           # config F5 "Run Carbon Theme" (Extension Development Host)
├─ assets/
│  ├─ carbon-ui-icons-outline.woff2
│  └─ carbon-ui-icons-solid.woff2
├─ dist/
│  ├─ carbon-theme-0.2.0.vsix   # builds anteriores
│  ├─ carbon-theme-0.3.0.vsix
│  └─ carbon-theme-0.3.1.vsix   # build actual (icono + ajustes de visualización)
├─ docs/
│  ├─ auto-apply.md
│  ├─ development.md
│  └─ reference.md
├─ file-icons/
│  ├─ dawn.json  deep.json  dim.json  you.json   # temas de iconos (generados)
│  ├─ source/                                    # copias prístinas de los 4 JSON
│  ├─ dawn/  dawn-light/  deep/  deep-light/     # SVG por paleta
│  ├─ dim/   dim-light/   you/   you-light/
│  ├─ icons/                                     # fuente neutral (no se empaqueta)
│  └─ out/                                       # código de Flow (no se empaqueta)
├─ icons/
│  ├─ carbon-icon-master.png        # arte original 256×256 (logo del README)
│  ├─ carbon-theme-icon-128.png     # icono de la extensión (package.json → "icon")
│  └─ carbon-theme-icon.ico         # 16×16, el manifiesto no lo usa
├─ product-icon/
│  ├─ Carbon-Product-Icons-Outline.json
│  └─ Carbon-Product-Icons-Solid.json
├─ scripts/
│  ├─ sync-flow-icons.mjs
│  └─ validate.mjs
├─ themes/
│  ├─ carbon-dark.json  carbon-light.json
│  └─ min-dark.json     min-light.json
├─ .vscodeignore
├─ extension.js
├─ package.json
└─ README.md
```

## Requisitos y entorno

- VS Code `^1.80.0` (campo `engines`).
- Node.js 18+ para los scripts (usan ESM y `fs.cpSync`).
- Empaquetado con `npx --yes @vscode/vsce` (se descarga al vuelo si hace
  falta).
- `scripts/validate.mjs` no necesita dependencias externas.

### Qué entra en la VSIX

`.vscodeignore` excluye `.vscode/`, `scripts/`, `dist/`, `file-icons/out/`,
`file-icons/icons/` y los `.DS_Store`. La build 0.3.1 queda en **7.643
archivos y 5,37 MB** (los SVG comprimen bien en el `.vsix`).

vsce avisa de que faltan `LICENSE` y `repository`; el paquete se genera con
`--allow-missing-repository --no-rewrite-relative-links` (sin el segundo flag,
vsce rechaza los enlaces relativos del README hacia `docs/`). Son ajustes
esperados en un paquete local.
