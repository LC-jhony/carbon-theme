# Carbon Light — Documentación del Tema

Tema de color claro para Visual Studio Code basado en el diseño IBM Carbon.

---

## Paleta de Colores

| Color | Hex | Uso principal |
|-------|-----|---------------|
| ![#C2185B](https://via.placeholder.com/15/C2185B/C2185B) | `#C2185B` | Keywords, operadores, variables especiales |
| ![#D84315](https://via.placeholder.com/15/D84315/D84315) | `#D84315` | Clases, funciones, métodos |
| ![#1565C0](https://via.placeholder.com/15/1565C0/1565C0) | `#1565C0` | Strings, enlaces |
| ![#00897B](https://via.placeholder.com/15/00897B/00897B) | `#00897B` | Números, booleanos, regexp, CSS values |
| ![#7B1FA2](https://via.placeholder.com/15/7B1FA2/7B1FA2) | `#7B1FA2` | Variables, brackets |
| ![#00695C](https://via.placeholder.com/15/00695C/00695C) | `#00695C` | Constantes, built-ins, atributos HTML |
| ![#8E24AA](https://via.placeholder.com/15/8E24AA/8E24AA) | `#8E24AA` | Parámetros, decoradores |
| ![#388E3C](https://via.placeholder.com/15/388E3C/388E3C) | `#388E3C` | Tags HTML, regexp escape, diff insertado |
| ![#D32F2F](https://via.placeholder.com/15/D32F2F/D32F2F) | `#D32F2F` | Errores, diff eliminado |
| ![#5A6B7A](https://via.placeholder.com/15/5A6B7A/5A6B7A) | `#5A6B7A` | Comentarios, puntuación |
| ![#2D3748](https://via.placeholder.com/15/2D3748/2D3748) | `#2D3748` | Texto oscuro, workarounds |

---

## Secciones de Token Colors

### 1. Comentarios
**Color:** `#5A6B7A` (gris) | *Cursiva*

**Scope:**
- `comment` — Cualquier comentario (`//`, `/* */`, `#`)
- `punctuation.definition.comment` — Símbolos que definen comentarios
- `string.comment` — Strings que parecen comentarios

**Ejemplos:**
```javascript
// Esto es un comentario
/* Comentario multilínea */
/* Este es otro */
# Comentario en Python
```

---

### 2. Constantes
**Color:** `#1E5FAD` (azul)

**Scope:**
- `constant` — Constantes generales
- `entity.name.constant` — Entidades nombradas como constantes
- `variable.other.constant` — Variables que son constantes
- `variable.language` — Variables del lenguaje (`undefined`, `Infinity`)

**Ejemplos:**
```javascript
const MAX_VALUE = 100;
const API_KEY = "abc123";
Infinity
NaN
undefined
```

---

### 3. Números
**Color:** `#00897B` (verde azulado)

**Scope:**
- `constant.numeric` — Cualquier número
- `constant.numeric.integer` — Enteros (`42`)
- `constant.numeric.float` — Decimales (`3.14`)
- `constant.numeric.hex` — Hexadecimales (`0xFF`)
- `constant.numeric.octal` — Octales (`0o77`)
- `constant.numeric.decimal` — Decimales explícitos

**Ejemplos:**
```javascript
42
3.14159
0xFF
0x1A3B5C
0o755
100_000
```

---

### 4. Booleanos y Null
**Color:** `#00897B` (verde azulado)

**Scope:**
- `constant.language.boolean` — `true`, `false`
- `constant.language.null` — `null`
- `constant.language.undefined` — `undefined`
- `constant.language.none` — `none` (Python, Rust)

**Ejemplos:**
```javascript
true
false
null
undefined
None  // Python
```

---

### 5. Entidades (Clases, Tipos, Módulos)
**Color:** `#D84315` (naranja)

**Scope:**
- `entity` — Entidades generales
- `entity.name` — Nombres de entidades
- `entity.name.class` — Nombres de clases
- `entity.name.type` — Nombres de tipos
- `entity.name.namespace` — Nombres de espacios de nombres
- `entity.name.module` — Nombres de módulos

**Ejemplos:**
```javascript
class User { }           // User
class MyClass { }         // MyClass
interface Config { }     // Config
type ID = string;        // ID
namespace Utils { }      // Utils
```

---

### 6. Parámetros de Función
**Color:** `#8E24AA` (púrpura)

**Scope:**
- `variable.parameter.function` — Parámetros en definiciones de funciones
- `variable.parameter` — Parámetros generales

**Ejemplos:**
```javascript
function greet(name, age) { }
//              ^^^^  ^^^ parámetros

const add = (a, b) => a + b;
//              ^  ^ parámetros
```

---

### 7. Etiquetas HTML/XML
**Color:** `#00897B` (verde azulado)

**Scope:**
- `entity.name.tag` — Nombres de etiquetas

**Ejemplos:**
```html
<div>...</div>
<span>texto</span>
<MyComponent />
<header>
<input type="text">
```

---

### 8. Atributos HTML/XML
**Color:** `#00695C` (verde oscuro)

**Scope:**
- `entity.other.attribute-name` — Nombres de atributos

**Ejemplos:**
```html
<div class="container" id="main">
<input type="text" disabled placeholder="...">
<a href="url" target="_blank">
```

---

### 9. Palabras Clave (Keywords)
**Color:** `#C2185B` (rosa/magenta)

**Scope:**
- `keyword` — Palabras clave generales
- `keyword.control` — Control de flujo (`if`, `else`, `for`, `while`)
- `keyword.control.import` — Importaciones (`import`, `require`)
- `keyword.control.export` — Exportaciones (`export`)
- `keyword.control.from` — Alias de importación (`from`, `as`)
- `keyword.control.as` — Alias (`as`)

**Ejemplos:**
```javascript
if (condition) { }
else { }
for (let i = 0; i < 10; i++) { }
while (true) { }
import { x } from 'y';
export default x;
const { a: alias } = obj;
```

---

### 10. Operadores de Palabra Clave
**Color:** `#C2185B` (rosa/magenta)

**Scope:**
- `keyword.operator` — Operadores de palabra clave
- `punctuation.accessor` — Acceso a propiedades (`->`, `.`)
- `keyword.operator.arrow` — Operador flecha (`->`)

**Ejemplos:**
```php
$obj->method();    // ->
$class::static();  // ::
$data?->name;     // ?.
```

---

### 11. Storage (Declaraciones de Tipo)
**Color:** `#C2185B` (rosa/magenta)

**Scope:**
- `storage` — Declaraciones de almacenamiento
- `storage.type` — Tipos de almacenamiento
- `storage.modifier` — Modificadores de almacenamiento

**Ejemplos:**
```javascript
var x = 1;
let y = 2;
const z = 3;
function myFunc() { }
class MyClass { }
interface MyInterface { }
type MyType = string;
```

---

### 12. Strings (Cadenas de Texto)
**Color:** `#1565C0` (azul)

**Scope:**
- `string` — Cualquier cadena de texto
- `punctuation.definition.string` — Comillas que definen strings
- `string punctuation.section.embedded source` — Código embebido en strings

**Ejemplos:**
```javascript
"hola mundo"
'texto simple'
`template literal`
"String con "subcadena""
```

---

### 13. Template Literals / Interpolación
**Color:** `#1565C0` (azul)

**Scope:**
- `string.template` — Template literals
- `punctuation.definition.template-expression` — `${}` en templates

**Ejemplos:**
```javascript
`Hola ${name}`
`El resultado es ${a + b}`
```

---

### 14. Support (Built-ins, Stdlib)
**Color:** `#00695C` (verde oscuro)

**Scope:**
- `support` — Soporte general
- `support.function` — Funciones built-in
- `support.class` — Clases built-in
- `support.type` — Tipos built-in
- `support.constant` — Constantes built-in

**Ejemplos:**
```javascript
console.log()      // console, log
Math.random()      // Math
Array.from()       // Array
Object.keys()      // Object
JSON.parse()       // JSON
```

---

### 15. Propiedades CSS
**Color:** `#00695C` (verde oscuro)

**Scope:**
- `meta.property-name` — Nombres de propiedades CSS
- `support.type.property-name` — Propiedades soportadas

**Ejemplos:**
```css
color: red;
background-color: #fff;
font-size: 16px;
display: flex;
```

---

### 16. Valores CSS
**Color:** `#00897B` (verde azulado)

**Scope:**
- `meta.property-value` — Valores de propiedades
- `support.constant.property-value` — Valores constantes

**Ejemplos:**
```css
color: red;
display: flex;
flex-direction: row;
z-index: 100;
```

---

### 17. Variables
**Color:** `#7B1FA2` (púrpura)

**Scope:**
- `variable` — Variables generales

**Ejemplos:**
```javascript
let count = 0;
count = count + 1;
console.log(count);
```

---

### 18. Otras Variables
**Color:** `#7B1FA2` (púrpura)

**Scope:**
- `variable.other` — Variables otras
- `variable.other.readwrite` — Variables lectura/escritura
- `variable.other.php` — Variables PHP
- `variable.other.property` — Propiedades de objetos

**Ejemplos:**
```javascript
obj.name
array[0]
$this->property  // PHP
$userData        // PHP
```

---

### 19. Variables Especiales PHP/Lenguaje
**Color:** `#C2185B` (rosa) | *Cursiva*

**Scope:**
- `variable.language.this` — `$this` en PHP
- `variable.language.self` — `self` en PHP
- `variable.language.parent` — `parent` en PHP
- `variable.language.static` — `static` en PHP

**Ejemplos:**
```php
$this->name
self::$staticProperty
parent::method();
```

---

### 20. Nombres de Funciones y Métodos
**Color:** `#D84315` (naranja)

**Scope:**
- `entity.name.function` — Nombres de funciones
- `entity.name.method` — Nombres de métodos
- `meta.function-call entity.name.function` — Llamadas a funciones
- `meta.function-call support.function` — Llamadas a funciones built-in

**Ejemplos:**
```javascript
function myFunction() { }
myFunction();
obj.myMethod();
console.log();
```

---

### 21. Inválido / Código Roto
**Color:** `#D32F2F` (rojo) | **Bold + Italic + Underline**

**Scope:**
- `invalid.broken` — Código roto
- `invalid.deprecated` — Código deprecado
- `invalid.illegal` — Código ilegal
- `invalid.unimplemented` — Código no implementado

**Ejemplos:**
```javascript
// Código con errores de sintaxis
const obj = { foo: 1, bar }
```

---

### 22. Expresiones Regulares (Regexp)
**Color:** `#00897B` (verde azulado)

**Scope:**
- `source.regexp` — Código regexp
- `string.regexp` — Strings que son regexp

**Ejemplos:**
```javascript
/pattern/flags
/\d+/g
/^abc$/i
```

---

### 23. Regexp Especial
**Color:** `#00897B` (verde azulado)

**Scope:**
- `string.regexp.character-class` — Clases de caracteres `[abc]`
- `string.regexp constant.character.escape` — Secuencias de escape
- `string.regexp source.ruby.embedded` — Regexp embebido en Ruby
- `string.regexp string.regexp.arbitrary-repetition` — Repeticiones `{n}`

**Ejemplos:**
```javascript
/[a-zA-Z]/
/\d+/
/\w+/
/a{2,4}/
```

---

### 24. Regexp Escape Bold
**Color:** `#388E3C` (verde) | **Bold**

**Scope:**
- `string.regexp constant.character.escape` — Secuencias de escape en regexp

**Ejemplos:**
```javascript
/\n/    // salto de línea
/\t/    // tab
/\s/    // espacio
```

---

### 25. Markup (Markdown)

#### 25.1 Listas
**Color:** `#7B1FA2` (púrpura)

**Scope:** `markup.list`

**Ejemplos:**
```markdown
- item 1
- item 2
* bullet
1. numbered
```

#### 25.2 Encabezados
**Color:** `#C2185B` (rosa) | **Bold**

**Scope:** `markup.heading`, `markup.heading entity.name`

**Ejemplos:**
```markdown
# Título 1
## Título 2
### Título 3
```

#### 25.3 Citas
**Color:** `#388E3C` (verde)

**Scope:** `markup.quote`

**Ejemplos:**
```markdown
> Esto es una cita
```

#### 25.4 Texto Inline
**Color:** `#2D3748` (oscuro)

**Scope:**
- `markup.italic` | *Cursiva*
- `markup.bold` | **Bold**

**Ejemplos:**
```markdown
*texto italic*
**texto bold**
```

#### 25.5 Código Inline
**Color:** `#00695C` (verde oscuro)

**Scope:** `markup.raw`, `markup.inline.raw`

**Ejemplos:**
```markdown
`código inline`
```

---

### 26. Diff / Cambios

| Tipo | Color | Scope |
|------|-------|-------|
| **Eliminado** | `#D32F2F` (rojo) | `markup.deleted`, `meta.diff.header.from-file` |
| **Insertado** | `#388E3C` (verde) | `markup.inserted`, `meta.diff.header.to-file` |
| **Modificado** | `#D84315` (naranja) | `markup.changed` |
| **Ignorado** | `#5A6B7A` (gris) | `markup.ignored`, `markup.untracked` |
| **Rangos** | `#7B1FA2` (púrpura) | `meta.diff.range` |
| **Headers** | `#00695C` (verde oscuro) | `meta.diff.header` |

**Ejemplos:**
```diff
- línea eliminada
+ línea añadida
~ línea modificada
@@ rango de cambios @@
```

---

### 27. Bracket Highlighter

#### 27.1 Brackets Resaltados
**Color:** `#7B1FA2` (púrpura)

**Scope:**
- `brackethighlighter.tag` — Tags HTML
- `brackethighlighter.curly` — Llaves `{}`
- `brackethighlighter.round` — Paréntesis `()`
- `brackethighlighter.square` — Corchetes `[]`
- `brackethighlighter.angle` — Ángulos `<>`
- `brackethighlighter.quote` — Comillas

#### 27.2 Brackets Sin Pareja
**Color:** `#D32F2F` (rojo)

**Scope:** `brackethighlighter.unmatched`

---

### 28. SublimeLinter (Linting Visual)

| Tipo | Color |
|------|-------|
| **Error** | `#D32F2F` (rojo) |
| **Warning** | `#D84315` (naranja) |
| **Gutter Mark** | `#5A6B7A` (gris) |

---

### 29. Enlaces
**Color:** `#1565C0` (azul) | **Underline**

**Scope:**
- `constant.other.reference.link` — Enlaces como referencias
- `string.other.link` — Enlaces en strings

**Ejemplos:**
```markdown
[Texto del enlace](https://ejemplo.com)
```

---

### 30. Puntuación
**Color:** `#5A6B7A` (gris)

**Scope:**
- `punctuation` — Puntuación general
- `punctuation.definition` — Definiciones de puntuación
- `punctuation.separator` — Separadores
- `punctuation.terminator` — Terminadores

**Ejemplos:**
```javascript
, . ; : ( ) { } [ ] < > ... ->
```

---

### 31. Anotaciones de Tipo
**Color:** `#00897B` (verde azulado)

**Scope:**
- `entity.name.type` — Nombres de tipos
- `support.type` — Tipos soportados
- `meta.type.annotation` — Anotaciones de tipo

**Ejemplos:**
```typescript
function greet(name: string): void { }
let count: number = 0;
const id: string | number = "abc";
```

---

### 32. Decoradores / Anotaciones
**Color:** `#8E24AA` (púrpura)

**Scope:**
- `meta.decorator` — Decoradores
- `punctuation.decorator` — Puntuación de decoradores
- `entity.name.function.decorator` — Nombres de decoradores

**Ejemplos:**
```typescript
@Injectable()
@Component({ ... })
@decorator
```

---

### 33. Operadores y Asignación
**Color:** `#C2185B` (rosa/magenta)

**Scope:**
- `keyword.operator.assignment` — `=`, `+=`, `-=`, etc.
- `keyword.operator.arithmetic` — `+`, `-`, `*`, `/`, `%`
- `keyword.operator.logical` — `&&`, `||`, `!`
- `keyword.operator.comparison` — `==`, `!=`, `<`, `>`, `<=`, `>=`
- `keyword.operator.bitwise` — `&`, `|`, `^`, `~`, `<<`, `>>`
- `keyword.operator.increment` — `++`, `--`
- `keyword.operator.decrement` — `--`
- `keyword.operator.ternary` — `?`, `:`
- `keyword.operator.spread` — `...`
- `keyword.operator.nullish` — `??`
- `keyword.operator.optional` — `?.`
- `keyword.operator.type` — `typeof`, `instanceof`
- `punctuation.separator.key-value` — `:`, `=>`

**Ejemplos:**
```javascript
a = 5
b += 10
c && d
x > y
arr.push(...items)
obj?.prop
```

---

### 34. PHP/Blade Tags
**Color:** `#00695C` (verde oscuro)

**Scope:**
- `punctuation.section.embedded.begin.php` — `<?php`
- `punctuation.section.embedded.end.php` — `?>`
- `punctuation.definition.tag.begin.blade` — `{{`
- `punctuation.definition.tag.end.blade` — `}}`
- `keyword.blade` — Directivas Blade
- `support.function.blade` — Funciones Blade
- `meta.tag.template.blade` — Tags de templates Blade

**Ejemplos:**
```blade
{{ $variable }}
@foreach($items as $item)
@if($condition)
@endsection
```

---

## UI del Editor (Colors)

### Activity Bar
- **Fondo:** `#ffffff`
- **Iconos activos:** `#000000`
- **Badge:** `#d73a49`

### Status Bar
- **Fondo:** `#ffffff`
- **Texto:** `#000000`

### Pestañas (Tabs)
- **Activa:** `#ffffff` con borde `#d73a49`
- **Inactiva:** `#ffffff`

### Sidebar
- **Fondo:** `#ffffff`
- **Texto:** `#000000`
- **Headers de sección:** `#ffffff`

### Editor
- **Fondo:** `#ffffff`
- **Línea actual:** `#fffbdf` (amarillo claro)
- **Números de línea:** `#babbbc`
- **Línea activa:** `#000000`
- **Selección:** `#fed442` (amarillo)

### Input
- **Borde:** `#b2b2b2`
- **Fondo:** `#ffffff`
- **Foco:** `#000000`

### Listas
- **Selección activa:** `#eeeeee` + `#d73a49`
- **Hover:** `#eeeeee` + `#d73a49`

---

## Instalación

1. Copia el archivo `carbon-light.json` a la carpeta `.vscode/themes/`
2. Abre VS Code
3. `Ctrl+Shift+P` → "Preferences: Color Theme"
4. Selecciona "Carbon light"

---

## Probando el Tema

Para inspeccionar qué token se aplica a una parte del código:

1. `Ctrl+Shift+P`
2. Busca "Developer: Inspect Editor Tokens and Scopes"
3. Haz clic en cualquier token del código

Esto te mostrará el scope y qué regla de color se aplica.
