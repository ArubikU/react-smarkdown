import React from 'react';
import * as shiki from 'shiki';
let langs = ['javascript', 'typescript', 'python', 'java', 'c', 'cpp', 'csharp', 'go', 'html', 'css', 'scss', 'json', 'yaml', 'xml', 'markdown', 'bash', 'shell', 'powershell', 'sql', 'php', 'ruby', 'perl', 'rust', 'swift', 'kotlin', 'dart', 'r', 'lua', 'groovy', 'scala', 'haskell', 'elm', 'erlang', 'ocaml', 'fsharp', 'clojure', 'plaintext', 'dockerfile'];
const HighlighterContext = React.createContext(null);
export const HighlighterProvider = ({ children }) => {
    const [highlighter, setHighlighter] = React.useState(null);
    React.useEffect(() => {
        (async () => {
            setHighlighter(await shiki.createHighlighter({
                themes: ['everforest-dark', 'everforest-light'],
                langs: langs
            }));
        })();
    }, []);
    return (React.createElement(HighlighterContext.Provider, { value: highlighter }, children));
};
function UseHighlighter({ content, lang, theme }) {
    const highlighter = React.useContext(HighlighterContext);
    if (!highlighter) {
        return React.createElement("code", null, content);
    }
    if (langs.includes(lang)) {
        return highlighter.codeToHtml(content, {
            lang: lang,
            theme: theme === 'light' ? 'everforest-light' : 'everforest-dark'
        });
    }
    else {
        return React.createElement("code", null, content);
    }
}
export { UseHighlighter };
