# Cómo funciona la auto-aplicación

Por qué la extensión cambia los iconos sola y por qué no toca los que eliges tú.
El código vive en [`extension.js`](../extension.js).

## El problema

VS Code no permite que un tema de color arrastre su propio icon pack. Si nada
lo hace, cada vez que cambias de tema tienes que elegir a mano el juego de
iconos. Y si una extensión los cambia por su cuenta, puede pisar una elección
deliberada del usuario (por ejemplo, Material Icon Theme).

La extensión resuelve lo primero sin caer en lo segundo: cambia los iconos
solo cuando el tema activo es suyo, y solo si los iconos actuales también son
suyos o nadie eligió ninguno.

## La idea

`extension.js` se activa con `onStartupFinished` y escucha los eventos que
pueden alterar el tema o los iconos:

- cambios en `workbench.colorTheme`, `workbench.preferredDarkColorTheme`,
  `workbench.preferredLightColorTheme`, `window.autoDetectColorScheme` y los
  ajustes de `carbonTheme.*`;
- cambios en el esquema de color activo (`onDidChangeActiveColorTheme`, por
  ejemplo cuando el sistema operativo pasa a modo oscuro).

Con cada evento calcula el label del tema activo y consulta la tabla:

```text
evento (inicio, cambio de tema, cambio de esquema, ajuste)
        │
        ▼
tema activo → ¿está en THEME_ICON_MAP? ──no──► no hace nada
        │ sí
        ▼
¿workbench.iconTheme lo fijó el usuario? ──sí──► ¿empieza por carbon-icons-?
        │ no                                       │ no ──► no lo toca
        │                                          │ sí ──► escribe el mapeo
        ▼
escribe el mapeo (Deep en oscuro, Dawn en claro)
```

El mapeo actual:

| Tema activo | `workbench.iconTheme` | `workbench.productIconTheme` |
| --- | --- | --- |
| Carbon Dark / Min Dark | `carbon-icons-deep` | `carbonSolid` |
| Carbon Light / Min Light | `carbon-icons-dawn` | `carbonOutline` |

## Detalles que importan

### El tema activo se identifica por label

`THEME_ICON_MAP` usa los labels en minúsculas (`"carbon dark"`, `"min light"`).
No hay API pública para leer el id del tema de color activo, así que el label
es la única llave disponible.

### Con auto-detección manda `preferred*ColorTheme`

Cuando `window.autoDetectColorScheme` está activo, VS Code ignora
`workbench.colorTheme` y resuelve el tema desde
`workbench.preferredDarkColorTheme` o `preferredLightColorTheme` según el
esquema del sistema. La extensión replica esa lógica: mira
`vscode.window.activeColorTheme.kind` y lee el `preferred*` que corresponde.
Si el valor está vacío, cae de vuelta a `workbench.colorTheme`.

### "Explícito" es una elección; los defaults no

Antes de escribir, la extensión inspecciona el ajuste en todos los scopes
(global, workspace y carpeta del workspace) con `inspect()`:

- Si nadie fijó un valor, escribe el mapeo (en Global).
- Si el valor actual empieza por `carbon-icons-` (o es `carbonSolid` /
  `carbonOutline`), lo trata como propio y lo puede cambiar entre paletas.
- Si el valor es de otro pack, no lo toca, aunque el tema activo sea Carbon.

Además escribe en el scope donde ya vivía el valor: si lo tenías en el
workspace, se actualiza ahí, no en el global.

### Deep y Dawn no distinguen claro/oscuro por sí solos

Los JSON de los iconos ya traen la variante `-light` y VS Code la usa
automáticamente cuando el tema de color es claro. Por eso el mapeo solo elige
paleta (Deep para temas oscuros, Dawn para claros) y no "dos juegos" separados
como hacía la versión anterior con `filled`/`outlined`.

## Ajustes que reescriben los temas de iconos

`carbonTheme.hidesExplorerArrows` y `carbonTheme.hidesExplorerFolders` no pueden
vivir en un JSON estático, así que `extension.js` reescribe
`file-icons/<paleta>.json` a partir de las copias prístinas de
`file-icons/source/`:

- `hidesExplorerArrows` cambia la propiedad nativa `hidesExplorerArrows` del
  documento; VS Code oculta entonces las flechas del explorador.
- `hidesExplorerFolders` elimina `folder`, `folderExpanded`, `folderNames` y
  `folderNamesExpanded` de las tres secciones (base, `light` y
  `highContrast`). `rootFolder` y `rootFolderExpanded` se conservan, igual que
  hacía Flow Icons: el root del workspace mantiene su icono.
- Las contribuciones llevan `"_watch": true`, la opción interna con la que VS
  Code vigila el archivo del tema activo y lo recarga cuando cambia. Por eso el
  efecto es inmediato, sin recargar la ventana. Ese recargado en caliente solo
  alcanza al tema activo: si otra paleta ya estaba cargada en la misma sesión,
  VS Code conserva su CSS en memoria y hay que recargar la ventana antes de
  volver a elegirla.
- Antes de escribir se compara con el contenido actual: si nada cambió no hay
  reescritura ni parpadeo, y con los ajustes en `false` el archivo vuelve a ser
  byte a byte el original.
- Si falta una copia de `source/`, la extensión deja el archivo publicado tal
  cual y avisa por consola.

## Compromisos

- **El label como llave es frágil.** Si el tema se renombra o se traduce, el
  mapeo deja de encontrarlo en silencio. `scripts/validate.mjs` protege solo
  el lado del repo: que los ids usados existan entre las contribuciones.
- **La detección con auto-detección es una aproximación.** Si configuras un
  tema claro en el slot oscuro (por ejemplo `preferredDarkColorTheme:
  "Min Light"`), `activeColorTheme.kind` dirá `Light` y la extensión leerá el
  slot claro. Es coherente con lo que VS Code muestra, pero puede sorprender
  si los slots están cruzados.
- **El respeto puede dejar iconos desactualizados.** Si tenías fijado un pack
  ajeno y el tema Carbon quiere otro, no habrá cambio automático: es el precio
  de no pisar decisiones.
- **Los archivos de iconos del VSIX no son estáticos.** Cualquier herramienta
  que compare el contenido del VSIX con el repo debe tener en cuenta que la
  extensión instalada reescribe sus propios `file-icons/<paleta>.json`.

## Alternativas descartadas

- **Sobrescribir siempre los iconos al detectar un tema Carbon.** Simple, pero
  pisa packs ajenos elegidos a propósito; la regla "no pisar" era un requisito.
- **Contribuir los iconos desde el propio tema de color.** No existe un
  contribution point que ligue un tema de color con un icon theme.
- **Leer y editar `settings.json` directamente.** Sería más frágil que usar
  `WorkspaceConfiguration.update()` y perdería los scopes y la validación de
  VS Code.
- **Variantes estáticas por combinación de ajustes.** Cuatro paletas × dos
  opciones × dos estados serían 16 temas de iconos contribuidos; reescribir el
  archivo desde una copia prístina es más simple y escala mejor.

## Relacionado

- [README.md](../README.md): instalación, temas y ajustes.
- [reference.md](reference.md): ids, rutas y comandos.
- [development.md](development.md): cómo probar cambios de este código.
