
# @arubiku/react-markdown

`@arubiku/react-markdown` is a React package that allows you to render Markdown content easily and efficiently, with support for code highlighting and customizable themes.

## Example
![Image](https://i.imgur.com/ky5ETvu.png)

[Live demo](https://arubiku.github.io/react-smarkdown-editor/)

## Installation

To install the package, run the following command in your terminal:

```bash
npm install @arubiku/react-markdown
# or
yarn add @arubiku/react-markdown
```

## Usage

To use the package in your application, you must first import the `HighlighterProvider` and the `SimpleMarkdown` component into your file:

```jsx
import React from 'react';
import { HighlighterProvider, SimpleMarkdown } from '@arubiku/react-markdown';

const App = () => {
    const markdownContent = `
# Hello, World!
This is an example of **Markdown** in our component.
## Example Code
Here is a block of code in JavaScript:
\`\`\`javascript
const hello = 'Hello, World!';
console.log(hello);
\`\`\`

> [!NOTE]
> This is a note.

$f(x) = 2x^2 + frac{3}{4}x + sqrt{x+1} + ∫_<0>^<1> x^2 dx + sum[i=1]^[n]{i^2} + lim<x->0> frac{sin(x)}{x}
`;
    return (
        <HighlighterProvider>
            <SimpleMarkdown content={markdownContent} />
        </HighlighterProvider>
    );
};

export default App;
```

### Props of the `SimpleMarkdown` Component

The `SimpleMarkdown` component accepts the following properties:

| Property           | Type     | Description                                                                     |
|--------------------|----------|---------------------------------------------------------------------------------|
| `content`          | `string` | The content in Markdown format that you want to render.                         |
| `className`        | `string` | Additional CSS classes for the container. The default is `dark:prose-invert`.   |
| `paragraphClass`   | `string` | CSS classes for paragraphs. Default is `my-2`.                                  |
| `imageHeight`      | `number` | Height of images in pixels. Default is `400`.                                   |
| `theme`            | `string` | Code highlighting theme. Default is `light`.                                    |
| `codeBlockTheme`   | `string` | CSS classes for code blocks. Default is `bg-[#fdf6e3] dark:bg-[#2d353b]`.       |
| `tableHeaderClass` | `string` | CSS classes for table headers. Default is `bg-gray-200 dark:bg-gray-700]`.      |
| `tableCellClass`   | `string` | CSS classes for table cells. Default is `border px-4 py-2`.                     |
| `extraAlerts`      | `AlertMarkdowns[]` | Extra alerts to be added to the markdown. Default is `[]`.            |

### Elements of the `AlertMarkdowns` Interface
| Property         | Type     | Description                                                                     |
|------------------|----------|---------------------------------------------------------------------------------|
| `SVG`            | `JSX.Element` | The SVG icon to be displayed.                                                  |
| `ID`             | `string` | The ID of the alert.                                                            |
| `CLASSNAME`      | `string` | The CSS class of the alert.                                                     |
| `TITLE`          | `string` | The title of the alert.                                                         |
| `COLOR`          | `string` | The color of the alert.                                                         |


> [!NOTE]
> To use the dark theme, ensure you have dark mode enabled in Tailwind CSS.

### Markdown Syntax 

The package supports the following Markdown syntax:
- Headers [#, ##, ###]
- Bold and italic text [`**bold**`, *italic*]
- Underline [`__a__`]
- Blockquotes `[>]`
- Special Block Quotes [> [!NOTE, !TIP, !IMPORTANT, !WARNING, !CAUTION]]
- Tables
- Images `[![alt text](image-url) or iframe]`
- Links `[text](url)`
- Code blocks `[```]`
- Inline code blocks `[`code`]`
- Math equations `$ {equation}` ex: `$ f(x) = 2x^2 + frac{3}{4}`

> Things not in the list are not supported yet.


### Functions

The package includes the following functions:

- `HighlighterProvider`: A context provider that supplies syntax highlighting capabilities to all child components.
- `SimpleMarkdown`: The main component for rendering Markdown content.

### Contributions

Contributions are welcome! If you wish to contribute to this project, please follow these steps:

1. Make a fork of the repository.
2. Create a new branch (`git checkout -b feature/new-feature`).
3. Make your changes and commit (`git commit -m 'I added new functionality'`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License.
