# Carbon Theme

<p align="center">
  <img src="icons/carbon-icon-master.png" alt="Carbon Theme" width="128" height="128">
</p>

Extensión de VS Code con los temas de color **Carbon** y **Min**, 4 temas de
iconos de archivo basados en las paletas de Flow Icons (`deep`, `dawn`, `dim` y
`you`) y 2 temas de iconos de producto a juego.

## Instalación rápida

```bash
# Desde la carpeta del proyecto
code --install-extension dist/carbon-theme-0.3.1.vsix --force
```

1. Recarga VS Code (`Developer: Reload Window`).
2. Abre el selector de temas con `Ctrl+K Ctrl+T` y elige **Carbon Dark** o
   **Carbon Light**.
3. Los file icons cambian solos al pack correspondiente. Para elegirlos a mano:
   `Preferences: File Icon Theme`.

## Temas incluidos

| Tema | Tipo | Archivo |
| --- | --- | --- |
| Carbon Dark | Oscuro | `themes/carbon-dark.json` |
| Carbon Light | Claro | `themes/carbon-light.json` |
| Min Dark | Oscuro | `themes/min-dark.json` |
| Min Light | Claro | `themes/min-light.json` |

`Min Dark` y `Min Light` son idénticos a `Carbon Dark` y `Carbon Light` salvo
el nombre del tema.

## File icons

| Tema | Paleta |
| --- | --- |
| Carbon Icons Deep | `deep` |
| Carbon Icons Dawn | `dawn` |
| Carbon Icons Dim | `dim` |
| Carbon Icons You | `you` |

Cada tema trae su variante oscura y su variante clara (`-light`), y VS Code
elige una u otra según el tema de color activo. Los iconos cubren 739 nombres
de archivo, 587 extensiones, 1.263 nombres de carpeta y 165 lenguajes.

### Ocultar flechas y carpetas

| Ajuste | Por defecto | Efecto |
| --- | --- | --- |
| `carbonTheme.hidesExplorerArrows` | `false` | Oculta las flechas del explorador. |
| `carbonTheme.hidesExplorerFolders` | `false` | Oculta los iconos de carpeta; el root del workspace conserva el suyo. |

Son los equivalentes a los antiguos `flow-icons.hidesExplorerArrows` y
`flow-icons.hidesExplorerFolders` de Flow Icons. Se aplican al momento sobre el
tema de iconos activo, sin recargar la ventana.

## Product icons

| Tema | Estilo |
| --- | --- |
| Carbon Solid | Relleno |
| Carbon Outline | Contorno |

## Auto-aplicación

Al activar un tema Carbon o Min, la extensión selecciona automáticamente los
iconos a juego:

| Tema activo | File icons | Product icons |
| --- | --- | --- |
| Carbon Dark / Min Dark | Carbon Icons Deep | Carbon Solid |
| Carbon Light / Min Light | Carbon Icons Dawn | Carbon Outline |

Reglas de comportamiento:

- No pisa un icon pack elegido por el usuario: solo actúa si el tema actual es
  de Carbon o si nunca se eligió uno.
- Funciona con `window.autoDetectColorScheme` activo: lee
  `workbench.preferredDarkColorTheme` / `preferredLightColorTheme` según el
  esquema activo.

Cómo funciona por dentro: [docs/auto-apply.md](docs/auto-apply.md).

### Ajustes

| Ajuste | Por defecto | Efecto |
| --- | --- | --- |
| `carbonTheme.autoApplyIcons` | `true` | Sincroniza el file icon theme al cambiar de tema. |
| `carbonTheme.autoApplyProductIcons` | `true` | Sincroniza el product icon theme. |

## Requisitos

- VS Code 1.80 o superior.
- Node.js 18+ solo para tareas de desarrollo (sincronizar iconos, validar,
  empaquetar).

## Documentación

| Documento | Para qué sirve |
| --- | --- |
| [docs/reference.md](docs/reference.md) | Referencia completa: contribuciones, ajustes, comandos, estructura y formato de los JSON. |
| [docs/development.md](docs/development.md) | Cómo desarrollar, ejecutar con F5, sincronizar iconos, validar y empaquetar. |
| [docs/auto-apply.md](docs/auto-apply.md) | Cómo funciona la auto-aplicación de iconos y por qué. |

## Estructura del proyecto

```text
carbon-theme/
├─ extension.js        # auto-aplicación de iconos y ajustes de visualización
├─ package.json        # manifiesto: temas, iconos, ajustes y scripts
├─ icons/              # logo de la extensión (PNG 128 y arte original)
├─ themes/             # 4 temas de color
├─ file-icons/         # iconos Flow: 1 JSON + 2 carpetas SVG por paleta
│  └─ source/          # copias prístinas de los 4 JSON (las usa extension.js)
├─ product-icon/       # 2 temas de iconos de producto
├─ assets/             # fuentes woff2 de los product icons
├─ docs/               # referencia, desarrollo y funcionamiento
├─ scripts/            # sync-flow-icons.mjs y validate.mjs
└─ dist/               # VSIX empaquetadas
```

## Licencia y uso

Los iconos de archivo provienen de la extensión de pago **Flow Icons**
(`thang-nm.flow-icons`). Este paquete es para uso local: no redistribuyas los
SVG ni la VSIX.
