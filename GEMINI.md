# Carbon Theme

## Project Overview
Carbon Theme is a faithful port of [michaeldyrynda/carbon.vim](https://github.com/michaeldyrynda/carbon.vim) to Visual Studio Code. It provides a clean, minimalist, and high-contrast color scheme for developers who prefer the Carbon aesthetic. The extension includes two variants:
- **Carbon Dark**: A deep charcoal-based theme optimized for focus.
- **Carbon Light**: A light grey-based theme for clear readability in bright environments.

This is a **pure theme extension**, meaning it consists entirely of JSON color definitions and does not include any TypeScript or JavaScript logic.

## Project Type
Visual Studio Code Theme Extension

## Key Files
- `package.json`: The extension manifest. Defines the extension's name, version, publisher, and contributes the theme paths to VS Code.
- `themes/carbon-dark.json`: The core color definition file for the dark variant.
- `themes/carbon-light.json`: The core color definition file for the light variant.
- `README.md`: Detailed information for users, including screenshots, color palettes, and recommended editor settings.
- `screenshot/`: Contains preview images used in the extension marketplace and README.
- `LICENSE.txt`: Project licensing (MIT).

## Building and Packaging
To package the extension for distribution (generating the `.vsix` file), use the `vsce` (Visual Studio Code Extension Manager) tool.

1.  **Install vsce (if not already installed):**
    ```bash
    npm install -g @vscode/vsce
    ```
2.  **Package the extension:**
    ```bash
    vsce package
    ```
    This will generate a file like `carbon-theme-0.0.1.vsix` in the root directory.

## Testing
To test the theme during development:
1.  Open this project folder in VS Code.
2.  Press `F5` (or go to the **Run and Debug** view and click **Launch Extension**).
3.  A new **Extension Development Host** window will open.
4.  In the new window, open the Command Palette (`Ctrl+Shift+P`), type "Color Theme", and select "Carbon Dark" or "Carbon Light" to preview the changes.

## Development Conventions
- **Adherence to Carbon.vim**: Color choices should strictly follow the original Vim port for consistency.
- **UI Theming**: Every aspect of the VS Code UI (sidebar, status bar, panels, editor, terminal) should be explicitly themed to ensure a cohesive experience.
- **Contrast**: Maintain high contrast for readability while keeping the minimalist aesthetic.
- **No Dependencies**: As a pure theme, avoid adding unnecessary npm dependencies to `package.json`.
