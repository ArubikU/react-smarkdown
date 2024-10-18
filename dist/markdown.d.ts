import React from 'react';
interface SimpleMarkdownProps {
    content: string;
    className?: string;
    ctexTclass?: string;
    imageHeight?: number;
    theme?: string;
    codeBlockTheme?: string;
}
declare const SimpleMarkdown: React.FC<SimpleMarkdownProps>;
export { SimpleMarkdown };
