# Cómo desarrollar la extensión

Guía para tocar código, iconos o temas y ver el resultado en VS Code. Para la
lista exacta de contribuciones y comandos mira
[reference.md](reference.md).

## Requisitos

- VS Code 1.80 o superior.
- Node.js 18 o superior (`node --version`).

## 1. Ejecutar en modo desarrollo (F5)

1. Abre la carpeta `carbon-theme` en VS Code.
2. Pulsa **F5**. Se abre una ventana **Extension Development Host** con la
   extensión cargada desde el código fuente. No hay build: `extension.js` es
   JavaScript plano y la config vive en `.vscode/launch.json`.
3. En esa ventana prueba el tema (`Ctrl+K Ctrl+T`) y los iconos
   (`Preferences: File Icon Theme`).
4. Para confirmar que cargó: `Developer: Show Running Extensions` debe listar
   **Carbon Theme**.

El log del Extension Host es compartido con tus otras extensiones (Laravel,
Database Client, etc.). Si ves errores ajenos al tema, no son de esta
extensión: `extension.js` solo registra mensajes propios si falla la escritura
de un ajuste o de los archivos de iconos.

## 2. Sincronizar los iconos desde Flow Icons

Los 4 JSON y las 8 carpetas SVG salen de la extensión Flow Icons instalada:

```bash
npm run sync:icons
```

Qué hace:

- Busca la versión más nueva de `thang-nm.flow-icons-*` en
  `~/.vscode/extensions`.
- Copia `dawn.json`, `deep.json`, `dim.json`, `you.json` a `file-icons/` y a
  `file-icons/source/` (la copia prístina que usa la extensión para
  regenerar).
- Reemplaza `file-icons/<paleta>/` y `file-icons/<paleta>-light/` con la copia
  de Flow.

> `file-icons/<paleta>.json` es un archivo generado: `extension.js` lo
> reescribe desde `file-icons/source/<paleta>.json` al activarse y al cambiar
> los ajustes `carbonTheme.hidesExplorer*`. No lo edites a mano; `validate`
> exige que siga idéntico a su copia de `source/` (si lo regeneraste probando,
> apaga los ajustes y recarga, o restaura con `npm run sync:icons`).

Para usar otra copia de Flow:

```bash
FLOW_ICONS_DIR=/ruta/a/flow-icons npm run sync:icons
```

Si Flow Icons no está instalada, `sync:icons` falla sin tocar nada; los iconos
del repo siguen siendo válidos. En ese caso `npm run check` solo avisa y
valida lo local.

## 3. Validar los cambios

```bash
npm run check
```

Corre dos cosas:

1. `check:icons`: que `file-icons/` (JSONs y carpetas SVG, incluida la copia de
   `source/`) coincida con la instalación de Flow (o exista, si Flow no está).
2. `validate`: que todas las rutas del manifiesto existan, que los temas
   coincidan con su label y tipo, que cada definición de icono resuelva a un
   SVG real (secciones base, `light` y `highContrast`), que cada tema de iconos
   tenga su gemelo prístino en `file-icons/source/` byte a byte y su
   `_watch: true`, que los ids que usa `extension.js` estén contribuidos y que
   los ajustes usados estén declarados.

## 4. Empaquetar e instalar

```bash
npm run package
code --install-extension dist/carbon-theme-<versión>.vsix --force
```

Después recarga VS Code (`Developer: Reload Window`). El `--force` reinstala
aunque sea la misma versión; si vas a iterar, sube `version` en
`package.json` para que VS Code trate la instalación como actualización.

Advertencias esperadas de vsce:

- `LICENSE not found`: el paquete es de uso local.
- `missing repository`: se silencia con `--allow-missing-repository`.
- `This extension consists of 7643 files`: son los SVG de las paletas, es
  normal.

El script también pasa `--no-rewrite-relative-links`: sin ese flag, vsce falla
al no poder convertir los enlaces relativos del README hacia `docs/` en URLs de
un repositorio.

## 5. Añadir o cambiar una paleta

1. Copia a `file-icons/` y a `file-icons/source/` el JSON `<paleta>.json`, y a
   `file-icons/` las carpetas `<paleta>/` y `<paleta>-light/` (o usa
   `npm run sync:icons` si vienen de Flow).
2. Añade la contribución en `package.json`:

   ```json
   {
     "id": "carbon-icons-<paleta>",
     "label": "Carbon Icons <Paleta>",
     "path": "./file-icons/<paleta>.json",
     "_watch": true
   }
   ```

3. Si debe aplicarse sola al activar un tema Carbon, añádela a
   `THEME_ICON_MAP` en `extension.js` y a `ICON_PALETTES` para que se regenere.
4. `npm run check` y sube la versión antes de empaquetar.

El validador exige que el id empiece por `carbon-icons-` y que id, ruta y
label sigan la convención `carbon-icons-<paleta>` → `./file-icons/<paleta>.json`
→ `Carbon Icons <Paleta>`.

## 6. Solución de problemas

| Síntoma | Causa | Solución |
| --- | --- | --- |
| La auto-aplicación no cambia los iconos | El `workbench.iconTheme` está fijado explícitamente a un pack ajeno y no se pisa por diseño | Quita la línea de `settings.json` o elige un `Carbon Icons *` a mano |
| No cambia al alternar claro/oscuro | Con `window.autoDetectColorScheme` activo, los `preferred*ColorTheme` no son Carbon/Min | Ajusta `workbench.preferredDarkColorTheme` y `preferredLightColorTheme` a temas Carbon o Min |
| Las flechas o las carpetas siguen visibles | El tema activo no es un `Carbon Icons *`, o el ajuste quedó bajo el viejo `flow-icons.*` (ya no existe) | Usa `carbonTheme.hidesExplorerArrows` / `hidesExplorerFolders` y activa un tema Carbon Icons; si persiste, recarga la ventana |
| `validate` avisa de que `file-icons/<paleta>.json` difiere de `source/` | Se regeneró con los ajustes de visualización activos (p. ej. tras usar F5) | Apaga los ajustes y recarga, o restaura con `npm run sync:icons` |
| F5 no abre el Extension Development Host | No estás en la carpeta del proyecto o falta `.vscode/launch.json` | Abre `carbon-theme` como carpeta y elige la config "Run Carbon Theme" |
| Sigo viendo la versión anterior | VS Code no recargó o no se reinstaló el VSIX | `code --install-extension ... --force` y `Developer: Reload Window` |
| `flow icons are out of sync` | Flow Icons se actualizó después del último sync | `npm run sync:icons` |
| Los iconos no aparecen en el selector | El VSIX instalado es viejo | Instala `dist/carbon-theme-0.3.1.vsix` con `--force` |

## Relacionado

- [README.md](../README.md): instalación y uso.
- [reference.md](reference.md): contribuciones, ajustes y estructura.
- [auto-apply.md](auto-apply.md): por qué la extensión respeta tus elecciones.
