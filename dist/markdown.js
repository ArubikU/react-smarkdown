import React from 'react';
import { UseHighlighter } from './highlighter';
const SimpleMarkdown = ({ content, className = 'dark:prose-invert', ctexTclass = "my-2", imageHeight = 400, theme = 'light', codeBlockTheme = "bg-[#fdf6e3] dark:bg-[#2d353b]" }) => {
    const parseMarkdown = (md) => {
        const lines = md.split('\n');
        let inCodeBlock = false;
        let html = '';
        let currentParagraph = '';
        let inList = false;
        let listType = '';
        let currentCodeLanguage = '';
        const flushParagraph = () => {
            if (currentParagraph) {
                html += `<p class="${ctexTclass}">${currentParagraph.trim()}</p>`;
                currentParagraph = '';
            }
        };
        const flushList = () => {
            if (inList) {
                html += `</${listType}>`;
                inList = false;
                listType = '';
            }
        };
        const parseInline = (text) => {
            // Bold
            text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            // Italic
            text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
            // Inline code
            text = text.replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 rounded">$1</code>');
            // Iframe
            text = text.replace(/<iframe.*?src=["']([^"']+)["'].*?><\/iframe>/g, `<iframe width="100%" height="${imageHeight}" src="$1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`);
            // Links with title (alias)
            text = text.replace(/\[([^\]]+)\]\(([^)]+)\s*"?(.*?)"?\)/g, '<a href="$2" title="$3" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">$1</a>');
            // Links without title
            text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">$1</a>');
            return text;
        };
        const highlightCode = (code, language) => {
            const codeComponent = UseHighlighter({ content: code, lang: language, theme: theme });
            return `${codeComponent}`;
        };
        let codeLines = [];
        lines.forEach((line, index) => {
            if (line.trim().startsWith('```')) {
                flushParagraph();
                flushList();
                inCodeBlock = !inCodeBlock;
                if (inCodeBlock) {
                    currentCodeLanguage = line.trim().slice(3).toLowerCase() || 'default';
                    html += `<pre><code class="language-${currentCodeLanguage} ${codeBlockTheme} block p-2 rounded-md my-2 overflow-x-auto">`;
                    codeLines = [];
                }
                else {
                    html += '</code></pre>';
                    currentCodeLanguage = '';
                }
            }
            else if (inCodeBlock) {
                html += highlightCode(line, currentCodeLanguage).replace(`<code`, `<span class="text-gray-400 dark:text-gray-500 text-sm">${codeLines.length + 1} | </span><code`);
                codeLines.push(line);
            }
            else {
                // Headers
                if (line.startsWith('#')) {
                    flushParagraph();
                    flushList();
                    const levelMatch = line.match(/^#+/);
                    if (levelMatch) {
                        const level = levelMatch[0].length;
                        const text = line.replace(/^#+\s*/, '');
                        html += `<h${level} class="text-${4 - level}xl font-bold mt-${8 - level} mb-${6 - level}">${parseInline(text)}</h${level}>`;
                    }
                }
                // Lists
                else if (/^\s*(\d+\.|-)\s+(.*)/.test(line)) {
                    flushParagraph();
                    const match = line.match(/^\s*(\d+\.|-)\s+(.*)/);
                    if (match) {
                        const isOrdered = match[1].endsWith('.');
                        if (!inList || (isOrdered && listType === 'ul') || (!isOrdered && listType === 'ol')) {
                            flushList();
                            listType = isOrdered ? 'ol' : 'ul';
                            html += `<${listType} class="list-${isOrdered ? 'decimal' : 'disc'} pl-5 my-2">`;
                            inList = true;
                        }
                        html += `<li>${parseInline(match[2])}</li>`;
                    }
                }
                // Images
                else if (/!\[([^\]]*)\]\(([^)]+)(?:\s+(\d+)x(\d+))?\)/.test(line)) {
                    flushParagraph();
                    line = line.replace(/!\[([^\]]*)\]\(([^)]+)(?:\s+(\d+)x(\d+))?\)/g, (match, alt, src, width, height) => {
                        const sizeAttr = width && height ? `width="${width}" height="${height}"` : '';
                        return `<img src="${src}" alt="${alt}" ${sizeAttr} class="my-2 rounded-md max-w-full">`;
                    });
                    html += line;
                }
                // Horizontal Rule
                else if (/^(-{3,}|\*{3,})$/.test(line.trim())) {
                    flushParagraph();
                    flushList();
                    html += '<hr class="my-4 border-t border-gray-300 dark:border-gray-700">';
                }
                // Paragraphs
                else {
                    if (line.trim() === '') {
                        flushParagraph();
                    }
                    else {
                        currentParagraph += parseInline(line) + ' ';
                    }
                }
            }
        });
        flushParagraph();
        flushList();
        return html;
    };
    console.log(parseMarkdown(content));
    //debug
    return React.createElement("div", { className: "prose " + className, dangerouslySetInnerHTML: { __html: parseMarkdown(content) } });
};
export { SimpleMarkdown };
