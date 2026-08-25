<p align="center">
  <img src="icons/carbon-icon-master.png" alt="Carbon Theme" width="128" height="128">
</p>

<h1 align="center">Carbon Theme</h1>

<p align="center">
  A faithful port of <a href="https://github.com/michaeldyrynda/carbon.vim">michaeldyrynda/carbon.vim</a> to Visual Studio Code.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-0.0.1-blue?style=flat-square" alt="Version">
  <img src="https://img.shields.io/badge/VS%20Code-1.134%2B-007ACC?style=flat-square&logo=visual-studio-code" alt="VS Code">
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License">
  <img src="https://img.shields.io/badge/theme-dark%20%7C%20light-1a1a2e?style=flat-square" alt="Themes">
</p>

---

## Screenshots

### Carbon Dark

![Carbon Dark](screenshot/theme-dark.png)

### Carbon Light

![Carbon Light](screenshot/theme-light.png)

## Color Palette

<details>
<summary><strong>Carbon Dark</strong></summary>

| Element | Color | Preview |
|---------|-------|---------|
| Background | `#171717` | ![#171717](https://img.shields.io/badge/-171717-171717) |
| Editor Background | `#171717` | ![#171717](https://img.shields.io/badge/-171717-171717) |
| Foreground | `#C9CCCD` | ![#C9CCCD](https://img.shields.io/badge/-C9CCCD-C9CCCD) |
| Accent | `#FF4262` | ![#FF4262](https://img.shields.io/badge/-FF4262-FF4262) |
| Selection | `#2C3F58` | ![#2C3F58](https://img.shields.io/badge/-2C3F58-2C3F58) |
| Line Highlight | `#FF42620D` | ![#FF4262](https://img.shields.io/badge/-FF42620D-FF4262) |
| Comment | `#5D6976` | ![#5D6976](https://img.shields.io/badge/-5D6976-5D6976) |

</details>

<details>
<summary><strong>Carbon Light</strong></summary>

| Element | Color | Preview |
|---------|-------|---------|
| Background | `#FFFFFF` | ![#FFFFFF](https://img.shields.io/badge/-FFFFFF-FFFFFF) |
| Editor Background | `#FFFFFF` | ![#FFFFFF](https://img.shields.io/badge/-FFFFFF-FFFFFF) |
| Foreground | `#2C3E50` | ![#2C3E50](https://img.shields.io/badge/-2C3E50-2C3E50) |
| Accent | `#FF4262` | ![#FF4262](https://img.shields.io/badge/-FF4262-FF4262) |
| Selection | `#3498DB` | ![#3498DB](https://img.shields.io/badge/-3498DB-3498DB) |
| Line Highlight | `#FF426208` | ![#FF4262](https://img.shields.io/badge/-FF426208-FF4262) |
| Comment | `#718096` | ![#718096](https://img.shields.io/badge/-718096-718096) |

</details>

## Installation

### From VS Code Marketplace

1. Open **VS Code**
2. Go to **Extensions** (`Ctrl+Shift+X`)
3. Search for **"Carbon Theme"**
4. Click **Install**

### From VSIX File

1. Download the `.vsix` file from [Releases](https://github.com/LC-jhony/carbon-theme/releases)
2. Open **VS Code**
3. Go to **Extensions** (`Ctrl+Shift+X`)
4. Click on **"Install from VSIX..."**
5. Select the downloaded file

## Activation

1. Open **Command Palette** (`Ctrl+Shift+P`)
2. Type **"Preferences: Color Theme"**
3. Select **"Carbon Dark"** or **"Carbon Light"**

## Features

- **Dark & Light themes** — Both variants included
- **Faithful Vim port** — Based on carbon.vim by Michael Dyrnda
- **Clean syntax highlighting** — Optimized for readability
- **Consistent UI colors** — All VS Code UI elements themed
- **Minimalist design** — Clean interface with no visual clutter

## Recommended Settings

Copy and paste this configuration into your `settings.json` file to achieve the full Carbon Theme experience:

```json
{
    "window.zoomLevel": 1,
    "editor.fontFamily": "Fira Code",
    "editor.fontSize": 16,
    "editor.lineHeight": 45,
    "editor.fontLigatures": true,
    "editor.stickyScroll.enabled": false,
    "editor.renderWhitespace": "none",
    "editor.minimap.enabled": false,
    "editor.colorDecorators": false,
    "editor.guides.indentation": false,
    "editor.renderLineHighlight": "none",
    "editor.bracketPairColorization.enabled": false,
    "editor.scrollbar.horizontal": "hidden",
    "editor.scrollbar.vertical": "hidden",
    "editor.scrollbar.verticalScrollbarSize": 0,
    "editor.scrollbar.horizontalScrollbarSize": 0,
    "editor.gotoLocation.multipleDeclarations": "goto",
    "editor.gotoLocation.multipleDefinitions": "goto",
    "editor.gotoLocation.multipleImplementations": "goto",
    "editor.gotoLocation.multipleReferences": "goto",
    "editor.gotoLocation.multipleTypeDefinitions": "goto",
    "editor.lineNumbers": "off",
    "git.decorations.enabled": false,
    "charmed-icons.hidesExplorerArrows": true,
    "workbench.statusBar.visible": false,
    "window.title": "${rootName}",
    "breadcrumbs.enabled": false,
    "editor.renderControlCharacters": false,
    "workbench.tree.indent": 16,
    "workbench.tree.renderIndentGuides": "none",
    "workbench.editor.showTabs": "none",
    "workbench.iconTheme": "charmed-light",
    "workbench.sideBar.location": "right",
    "window.menuBarVisibility": "toggle",
    "window.commandCenter": false,
    "workbench.editor.editorActionsLocation": "hidden",
    "workbench.layoutControl.enabled": false,
    "workbench.browser.showInTitleBar": false,
    "flow-icons.hidesExplorerFolders": true,
    "flow-icons.hidesExplorerArrows": true,
    "workbench.secondarySideBar.defaultVisibility": "visible",
    "git.enableSmartCommit": true,
    "explorer.confirmDragAndDrop": false
}
```

### Recommended Icon Packs

Enhance your coding experience with these carefully selected icon extensions:

| Extension | Description |
|-----------|-------------|
| [Charmed Icons](https://marketplace.visualstudio.com/items?itemName=littensy.charmed-icons) | Elegant icon set for file explorers |
| [Flow Icons](https://flow-icons.pages.dev/) | Modern icons with smooth animations |

---

## Author

**LC-jhony**
- GitHub: [@LC-jhony](https://github.com/LC-jhony)
- Email: jhonyapm94@gmail.com

## License

This project is licensed under the [MIT License](LICENSE.txt).

---

<p align="center">
  Enjoy coding with <strong>Carbon</strong>!
</p>
