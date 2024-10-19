import React from 'react'
import { SimpleMarkdown } from '../dist/markdown'

const markdownContent = `
# Welcome to Our Markdown Page

This page demonstrates the capabilities of our SimpleMarkdown component.

## Features

1. **Bold** and *italic* text
2. Lists (like this one!)
3. [Links](https://example.com)
4. Code blocks

\`\`\`javascript
const greeting = 'Hello, world!';
console.log(greeting);
\`\`\`

## Admonitions

> [!NOTE]
> This is a note admonition.

> [!TIP]
> Here's a helpful tip!

## Table

| Column 1 | Column 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |

Enjoy using SimpleMarkdown!
`

export default function MarkdownPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <SimpleMarkdown 
        content={markdownContent}
        className="prose dark:prose-invert max-w-none"
        ctexTclass="my-4"
        imageHeight={300}
        theme="light"
        codeBlockTheme="bg-gray-100 dark:bg-gray-800"
      />
    </div>
  )
}