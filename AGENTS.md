# AGENTS.md - Carbon Theme Development Guide

## Project Overview

This is a VS Code theme extension that provides a faithful port of the Carbon Vim color scheme to Visual Studio Code. The extension defines two themes:
- **Carbon Dark** (`themes/carbon-dark.json`)
- **Carbon Light** (`themes/carbon-light.json`)

## Project Type

- **Type**: VS Code Theme Extension (JSON-based)
- **Language**: JSON only
- **No build system required** - themes are plain JSON files loaded directly by VS Code

---

## Commands

### Testing the Theme

Since this is a JSON-based theme with no build process:

1. **Install the extension locally**:
   ```bash
   code --install-extension .
   ```

2. **Reload VS Code** after making changes to see updates

3. **Use VS Code's developer tools** to inspect token colors:
   - Open Command Palette → "Developer: Inspect Editor Tokens and Scopes"

### No Additional Commands

This project does not use:
- No npm scripts
- No linters
- No test frameworks
- No TypeScript/JavaScript

---

## Code Style Guidelines

### JSON Formatting

- **Indentation**: 2 spaces
- **Quotes**: Double quotes for strings (standard JSON)
- **No trailing commas**: Valid JSON only
- **No comments**: JSON does not support comments

### Theme File Structure

Follow the existing pattern in `themes/carbon-dark.json`:

```json
{
  "name": "Theme Name",
  "type": "dark|light",
  "colors": {
    // UI colors - keep alphabetical within logical groups
    "focusBorder": "#ffffff00",
    "foreground": "#f4f4f4",
    ...
  },
  "tokenColors": [
    {
      "name": "Token Name",
      "scope": ["scope1", "scope2"],
      "settings": {
        "foreground": "#hexcode",
        "fontStyle": "bold|italic|underline"
      }
    }
  ]
}
```

### Color Guidelines

- Use hex colors with 6 digits (e.g., `#161616`)
- Use 8-digit hex with alpha (e.g., `#ffffff00`) for transparent colors
- Follow IBM Carbon Design System palette where applicable
- Keep contrast ratios accessible (WCAG AA minimum)

### Naming Conventions

- Theme names: "Carbon Dark", "Carbon Light"
- Token names: Title case (e.g., "Comment", "String Literal")
- Scope names: Dot-separated lowercase (e.g., `comment`, `string.quoted`)

### Token Scope Organization

Group token colors by language element type:
1. Comments
2. Strings
3. Numbers and constants
4. Keywords and operators
5. Functions and methods
6. Types and classes
7. Variables and parameters
8. Punctuation

### Error Handling

- Validate JSON syntax before commits (VS Code does this automatically)
- Use "Developer: Inspect Editor Tokens and Scopes" to verify token application
- Test both dark and light themes after changes

---

## File Reference

### Key Files

| File | Purpose |
|------|---------|
| `package.json` | Extension manifest |
| `themes/carbon-dark.json` | Dark theme definition |
| `themes/carbon-light.json` | Light theme definition |

---

## VS Code Theme Schema

Reference: https://code.visualstudio.com/api/references/theme-color

Common color keys:
- `editor.background`, `editor.foreground`
- `activityBar.*`, `statusBar.*`
- `sideBar.*`, `panel.*`
- `input.*`, `button.*`
- `tab.*`, `editorLineNumber.*`

Token scopes should match TextMate grammar patterns used by VS Code's syntax highlighting.
