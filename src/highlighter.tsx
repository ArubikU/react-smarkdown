import React from 'react';
import * as shiki from 'shiki';

let langs = ['javascript', 'typescript', 'python', 'java', 'c', 'cpp', 'csharp', 'go', 'html', 'css', 'scss', 'json', 'yaml', 'xml', 'markdown', 'bash', 'shell', 'powershell', 'sql', 'php', 'ruby', 'perl', 'rust', 'swift', 'kotlin', 'dart', 'r', 'lua', 'groovy', 'scala', 'haskell', 'elm', 'erlang', 'ocaml', 'fsharp', 'clojure', 'plaintext', 'dockerfile']


const HighlighterContext = React.createContext<shiki.Highlighter | null>(null);

export const HighlighterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [highlighter, setHighlighter] = React.useState<shiki.Highlighter | null>(null);

    React.useEffect(() => {
        (async () => {
            setHighlighter(await shiki.createHighlighter({
                themes: ['everforest-dark', 'everforest-light'],
                langs: langs
            }));
        })();
    }, []);

    return (
        <HighlighterContext.Provider value={highlighter}>
            {children}
        </HighlighterContext.Provider>
    )
}

function UseHighlighter({content, lang, theme}: {content: string, lang: string, theme: string}): React.ReactNode {
    const highlighter = React.useContext(HighlighterContext);
    if(!highlighter) {
        return <code>{content}</code>
    }

    if(langs.includes(lang)){

        return highlighter.codeToHtml(content, {
            lang: lang,
            theme: theme === 'light' ? 'everforest-light' : 'everforest-dark'
        });
    }
    else{
        return <code>{content}</code>
    }
}



export { UseHighlighter };

