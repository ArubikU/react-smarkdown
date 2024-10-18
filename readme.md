# @arubiki/react-markdown
`@arubiki/react-markdown` is a React package that allows you to render Markdown content easily and efficiently, with support for code highlighting and customisable themes.
## Installation
To install the package, run the following command in your terminal:
````bash
npm install @arubiki/react-markdown
o
yarn add @arubiki/react-markdown
```
## Usage
To use the package in your application, you must first import the HighlighterProvider and the SimpleMarkdown component into your file:
````jsx
import React from ‘react’;
import { HighlighterProvider, SimpleMarkdown } from ‘@arubiki/react-markdown’;
const App = () => {
    const markdownContent = `
# Hello, World!
This is an example of **Markdown** in our component.
## Example Code
Here is a block of code in JavaScript:
\`javascript
const hello = ‘Hello, World!
console.log(hello);
\`\`\`
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
| Property | Type | Description |
|-------------------|-------------|-----------------------------------------------------|
| `content` | `string` | The content in Markdown format that you want to render. |
| | `className` | `string` | Additional CSS classes for the container. The default is ``dark:prose-invert``. |
| `ctexTclass` | `string` | CSS classes for paragraphs. Default is `‘my-2’`. |
| `imageHeight` | `number` | Height of images in pixels. Default is `400`.
| `theme` | `string` | Code highlighting theme. Default is ``light``. |
| `codeBlockTheme` | `string` | CSS classes for code blocks. Default is `‘bg-[#fdf6e3] dark:bg-[#2d353b]’`. |
**Note:** To use the dark: you need to have the dark theme enabled in tailwindcss.

## Contributions
Contributions are welcome. If you wish to contribute to this project, please follow these steps:
1. Make a fork of the repository.
2. Create a new branch (`git checkout -b feature/new-feature`).
3. Make your changes and commit (`git commit -m ‘I added new functionality’`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Open a Pull Request.
## License
This project is licensed under the MIT License.