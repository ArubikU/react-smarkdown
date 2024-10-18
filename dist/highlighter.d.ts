import React from 'react';
export declare const HighlighterProvider: React.FC<{
    children: React.ReactNode;
}>;
declare function UseHighlighter({ content, lang, theme }: {
    content: string;
    lang: string;
    theme: string;
}): React.ReactNode;
export { UseHighlighter };
