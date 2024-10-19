import React from 'react';
interface AlertMarkdowns {
    SVG: JSX.Element;
    ID: string;
    CLASSNAME: string;
    TITLE?: string;
    COLOR?: string;
}
interface SimpleMarkdownProps {
    content: string;
    className?: string;
    ctexTclass?: string;
    imageHeight?: number;
    theme?: 'light' | 'dark';
    codeBlockTheme?: string;
    tableHeaderClass?: string;
    tableCellClass?: string;
    extraAlerts?: AlertMarkdowns[];
}
declare function SimpleMarkdown({ content, className, ctexTclass, imageHeight, theme, codeBlockTheme, tableHeaderClass, tableCellClass, extraAlerts }: SimpleMarkdownProps): React.JSX.Element;
export { SimpleMarkdown };
