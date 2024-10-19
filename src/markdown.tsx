import React from 'react';
import { renderToString } from 'react-dom/server';
import { UseHighlighter } from './highlighter';
const CodeLanguageRemap = {
  'js': 'javascript',
  'jsx': 'javascript',
  'ts': 'typescript',
  'tsx': 'typescript',
  'py': 'python',
  'rb': 'ruby',
  'c#': 'csharp',
  'c++': 'cpp',
  'cs': 'c#',
  'kt': 'kotlin',
  'go': 'golang',
  'rs': 'rust',
  'sh': 'bash',
  'md': 'markdown',
  'yml': 'yaml',
  'docker': 'dockerfile',
};

//f(x) = 2x^2 + frac{3}{4}x + sqrt{x+1} + ∫_<0>^<1> x^2 dx + sum[i=1]^[n]{i^2} + lim<x->0> frac{sin(x)}{x}
type MathToken = {
    type: 'text' | 'superscript' | 'subscript' | 'fraction' | 'sqrt' | 'operator' | 'derivative' | 'integral' | 'sum' | 'limit' | 'function'
    value: string
  }
  
  const tokenize = (input: string): MathToken[] => {
    const tokens: MathToken[] = []
    let current = 0
  
    while (current < input.length) {
      if (input[current] === '^') {
        let value = ''
        current++
        if (input[current] === '{') {
          current++
          while (input[current] !== '}' && current < input.length) {
            value += input[current]
            current++
          }
          current++
        } else {
          value = input[current]
          current++
        }
        tokens.push({ type: 'superscript', value })
      } else if (input[current] === '_') {
        let value = ''
        current++
        if (input[current] === '{') {
          current++
          while (input[current] !== '}' && current < input.length) {
            value += input[current]
            current++
          }
          current++
        } else {
          value = input[current]
          current++
        }
        tokens.push({ type: 'subscript', value })
      } else if (input.slice(current, current + 5) === 'frac{') {
        let numerator = ''
        let denominator = ''
        current += 5
        while (input[current] !== '}' && current < input.length) {
          numerator += input[current]
          current++
        }
        current += 2 // Skip '}{' 
        while (input[current] !== '}' && current < input.length) {
          denominator += input[current]
          current++
        }
        current++
        tokens.push({ type: 'fraction', value: `${numerator}|${denominator}` })
      } else if (input.slice(current, current + 5) === 'sqrt{') {
        let value = ''
        current += 5
        while (input[current] !== '}' && current < input.length) {
          value += input[current]
          current++
        }
        current++
        tokens.push({ type: 'sqrt', value })
      } else if ('+-*/='.includes(input[current])) {
        tokens.push({ type: 'operator', value: input[current] })
        current++
      } else if (input.slice(current, current + 2) === 'd/') {
        let variable = ''
        current += 2
        while (current < input.length && input[current] !== ' ') {
          variable += input[current]
          current++
        }
        tokens.push({ type: 'derivative', value: variable })
      } else if (input.slice(current, current + 3) === '∫_<') {
        let lowerBound = ''
        let upperBound = ''
        let integrand = ''
        current += 3
        while (input[current] !== '>' && current < input.length) {
          lowerBound += input[current]
          current++
        }
        current += 2 // Skip '>^<'
        while (input[current] !== '>' && current < input.length) {
          upperBound += input[current]
          current++
        }
        current += 1 // Skip '>'
        while (current < input.length && input[current] !== 'd') {
          integrand += input[current]
          current++
        }
        let variable = ''
        if (current < input.length) {
          current++ // Skip 'd'
          variable = input[current]
          current++
        }
        tokens.push({ type: 'integral', value: `${lowerBound}|${upperBound}|${integrand}|${variable}` })
      } else if (input.slice(current, current + 4) === 'sum[') {
        let lowerBound = ''
        let upperBound = ''
        let summand = ''
        current += 4
        while (input[current] !== ']' && current < input.length) {
          lowerBound += input[current]
          current++
        }
        current += 3 // Skip ']^['
        while (input[current] !== ']' && current < input.length) {
          upperBound += input[current]
          current++
        }
        current += 1 // Skip ']'
        if (input[current] === '{') {
          current++ // Skip '{'
          let braceCount = 1
          while (braceCount > 0 && current < input.length) {
            if (input[current] === '{') braceCount++
            if (input[current] === '}') braceCount--
            if (braceCount > 0) summand += input[current]
            current++
          }
        }
        tokens.push({ type: 'sum', value: `${lowerBound}|${upperBound}|${summand}` })
      } else if (input.slice(current, current + 4) === 'lim<') {
        let variable = ''
        let approach = ''
        current += 4
        while (input[current] !== '-' && current < input.length) {
          variable += input[current]
          current++
        }
        current += 2 // Skip '->'
        while (input[current] !== '>' && current < input.length) {
          approach += input[current]
          current++
        }
        current += 1
        tokens.push({ type: 'limit', value: `${variable}|${approach}` })
      } else if (input[current] === '(') {
        // Handle function calls with parameters
        let funcName = '';
        while (current > 0 && /[a-zA-Z]/.test(input[current - 1])) {
          funcName = input[current - 1] + funcName;
          current--;
        }
        current++; // Skip '('
        let params = '';
        while (input[current] !== ')' && current < input.length) {
          params += input[current];
          current++;
        }
        current++; // Skip ')'
        tokens.push({ type: 'function', value: `${funcName}(${params})` });
      }else {
        let value = ''
        while (current < input.length && !'+-*/=^_'.includes(input[current]) && 
               input.slice(current, current + 5) !== 'frac{' && 
               input.slice(current, current + 5) !== 'sqrt{' && 
               input.slice(current, current + 3) !== '∫_<' && 
               input.slice(current, current + 4) !== 'sum[' && 
               input.slice(current, current + 4) !== 'lim<') {
          value += input[current]
          current++
        }
        tokens.push({ type: 'text', value })
      }
    }
  
    return tokens
  }
  
  const MathToken: React.FC<{ token: MathToken }> = ({ token }) => {
    switch (token.type) {
      case 'superscript':
        return <sup className="text-xs">{token.value}</sup>
      case 'subscript':
        return <sub className="text-xs">{token.value}</sub>
      case 'fraction':
        const [numerator, denominator] = token.value.split('|')
        return (
          <span className="inline-flex flex-col items-center justify-center mx-1">
            <span className="text-center">{numerator}</span>
            <span className="border-t border-black w-full my-1"></span>
            <span className="text-center">{denominator}</span>
          </span>
        )
      case 'sqrt':
        return (
          <span className="inline-flex items-baseline">
            <span className="text-2xl">√</span>
            <span className="border-t border-black pt-1 ml-1 translate-y-2"><span className="-translate-y-12">{token.value}</span></span>
          </span>
        )
      case 'operator':
        return <span className="mx-2">{token.value}</span>
      case 'derivative':
        return (
          <span className="inline-flex items-baseline">
            <span className="mr-1">d/d{token.value}</span>
          </span>
        )
      case 'integral':
        const [lowerBound, upperBound, integrand, variable] = token.value.split('|')
        return (
          <span className="inline-flex items-center mx-2 relative">
            <span className="text-3xl mr-1">∫</span>
            <span className="flex flex-col items-center text-xs absolute" style={{ left: '0.5em', height: '100%' }}>
              <sup className="transform translate-y-1 translate-x-2">{upperBound}</sup>
              <sub className="transform translate-y-8 translate-x-2">{lowerBound}</sub>
            </span>
            <span className="ml-3">{integrand}</span>
            <span className="ml-1">d{variable}</span>
          </span>
        )
      case 'sum':
        const [sumLower, sumUpper, summand] = token.value.split('|')
        return (
          <span className="inline-flex items-center mx-2">
            <span className="text-3xl mr-1">Σ</span>
            <span className="flex flex-col items-center text-xs">
              <sup className="-mt-1 -translate-y-1">{sumUpper}</sup>
              <sub className="mt-1 translate-y-3">{sumLower}</sub>
            </span>
            <span className="ml-1">
              {tokenize(summand).map((subToken, index) => (
                <MathToken key={index} token={subToken} />
              ))}
            </span>
          </span>
        )
      case 'limit':
        const [limVariable, approach] = token.value.split('|')
        return (
          <span className="inline-flex items-baseline mx-2">
            <span className="mr-1">lim</span>
            <sub className="text-xs">
              {limVariable}→{approach}
            </sub>
          </span>
        )
      default:
        return <span>{token.value}</span>
    }
  }
  

const DefaultIcons = {
    NOTE: (
        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24" className="mr-2">
            <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"></path>
        </svg>
    ),
    TIP: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className="mr-2"><path d="M8 1.5c-2.363 0-4 1.69-4 3.75 0 .984.424 1.625.984 2.304l.214.253c.223.264.47.556.673.848.284.411.537.896.621 1.49a.75.75 0 0 1-1.484.211c-.04-.282-.163-.547-.37-.847a8.456 8.456 0 0 0-.542-.68c-.084-.1-.173-.205-.268-.32C3.201 7.75 2.5 6.766 2.5 5.25 2.5 2.31 4.863 0 8 0s5.5 2.31 5.5 5.25c0 1.516-.701 2.5-1.328 3.259-.095.115-.184.22-.268.319-.207.245-.383.453-.541.681-.208.3-.33.565-.37.847a.751.751 0 0 1-1.485-.212c.084-.593.337-1.078.621-1.489.203-.292.45-.584.673-.848.075-.088.147-.173.213-.253.561-.679.985-1.32.985-2.304 0-2.06-1.637-3.75-4-3.75ZM5.75 12h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1 0-1.5ZM6 15.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Z"></path></svg>
    ),
    IMPORTANT: (
        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24" className="mr-2">
            <path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v9.5A1.75 1.75 0 0 1 14.25 13H8.06l-2.573 2.573A1.458 1.458 0 0 1 3 14.543V13H1.75A1.75 1.75 0 0 1 0 11.25Zm1.75-.25a.25.25 0 0 0-.25.25v9.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h6.5a.25.25 0 0 0 .25-.25v-9.5a.25.25 0 0 0-.25-.25Zm7 2.25v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path>
        </svg>
    ),
    WARNING: (
        <svg fill="currentColor" 
        width="24" height="24" viewBox="0 0 24 24">
   <g>
       <path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"/>
   </g>
   </svg>
    ),
    CAUTION: (
        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24" className="mr-2">
            <path d="M4.47.22A.749.749 0 0 1 5 0h6c.199 0 .389.079.53.22l4.25 4.25c.141.14.22.331.22.53v6a.749.749 0 0 1-.22.53l-4.25 4.25A.749.749 0 0 1 11 16H5a.749.749 0 0 1-.53-.22L.22 11.53A.749.749 0 0 1 0 11V5c0-.199.079-.389.22-.53Zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5ZM8 4a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"></path>
        </svg>
    )
};


const DefaultalertTypes = {
    NOTE: 'bg-blue-100  border-blue-500 dark:bg-transparent',
    TIP: 'bg-green-100 border-green-500  dark:bg-transparent',
    IMPORTANT: 'bg-purple-100 border-purple-500  dark:bg-transparent',
    WARNING: 'bg-orange-100 border-orange-500  dark:bg-transparent',
    CAUTION: 'bg-red-100 border-red-500  dark:bg-transparent',
    DEFAULT: 'bg-gray-100 border-gray-500  dark:bg-transparent'
}


const DefaultalertTextTitles = {
    NOTE: 'Note',
    TIP: 'Tip',
    IMPORTANT: 'Important',
    WARNING: 'Warning',
    CAUTION: 'Caution'
}
const DefaultalertTextColors = {
    NOTE: 'text-blue-500',
    TIP: 'text-green-500',
    IMPORTANT: 'text-purple-500',
    WARNING: 'text-orange-500',
    CAUTION: 'text-red-500'
}

interface AlertMarkdowns {
    SVG: JSX.Element
    ID: string
    CLASSNAME: string
    TITLE?: string
    COLOR?: string
}

interface SimpleMarkdownProps {
    content: string
    className?: string
    ctexTclass?: string
    imageHeight?: number
    theme?: 'light' | 'dark'
    codeBlockTheme?: string
    tableHeaderClass?: string
    tableCellClass?: string
    extraAlerts?: AlertMarkdowns[]
}

 function SimpleMarkdown({
    content,
    className = 'dark:prose-invert',
    ctexTclass = "my-2",
    imageHeight = 400,
    theme = 'light',
    codeBlockTheme = "bg-[#fdf6e3] dark:bg-[#2d353b]",
    tableHeaderClass = "bg-gray-200 dark:bg-gray-700",
    tableCellClass = "border px-4 py-2",
    extraAlerts = []
}: SimpleMarkdownProps) {

    const icons = { ...DefaultIcons }
    const alertTypes = { ...DefaultalertTypes }
    const alertTextTitles = { ...DefaultalertTextTitles }
    const alertTextColors = { ...DefaultalertTextColors }
    //add extra alerts
    extraAlerts.forEach(alert => {
        icons[alert.ID] = alert.SVG
        alertTypes[alert.ID] = alert.CLASSNAME
        alertTextTitles[alert.ID] = alert.TITLE || alert.ID.toLowerCase().replace(/^\w/, c => c.toUpperCase())
        alertTextColors[alert.ID] = alert.COLOR || ''
    })    

    const parseMarkdown = (md: string): string => {
        const lines = md.split('\n')
        let inCodeBlock = false
        let html = ''
        let currentParagraph = ''
        let inList = false
        let listType = ''
        let currentCodeLanguage = 'markdown'
        let inTable = false
        let tableHeader = ''
        let tableBody = ''
        let inBlockQuote = false
        let blockQuoteContent = ''
        let blockQuoteType = ''

        const flushParagraph = () => {
            if (currentParagraph) {
                html += `<p class="${ctexTclass}">${currentParagraph.trim()}</p>`
                //add \n
                currentParagraph = ''
            }
        }

        const flushList = () => {
            if (inList) {
                html += `</${listType}>`
                inList = false
                listType = ''
            }
        }

        const flushTable = () => {
            if (inTable) {
                html += `<table class="border-collapse table-auto w-full text-sm my-4">
            <thead class="${tableHeaderClass}">${tableHeader}</thead>
            <tbody>${tableBody}</tbody>
          </table>`
                inTable = false
                tableHeader = ''
                tableBody = ''
            }
        }

        const flushBlockQuote = () => {
            if (inBlockQuote) {
                const alertClass = alertTypes[blockQuoteType as keyof typeof alertTypes] || alertTypes.DEFAULT
                html += `<blockquote class="border-l-4 pl-4 py-2 my-4 ${alertClass}">${blockQuoteContent}</blockquote>`
                //replace the [!alertType] with the corresponding icon
                //return `<div class="flex items-center">${renderToString(icons[type as keyof typeof icons])}<span class="ml-2">${match.slice(2)}</span></div>`
                for (const type in icons) {
                    
                    let text =  alertTextTitles[blockQuoteType as keyof typeof alertTextTitles] || blockQuoteType.toLowerCase().replace(/^\w/, c => c.toUpperCase())
                    html = html.replace(`[!${type.toUpperCase()}]`, `<div class="flex items ${alertTextColors[blockQuoteType as keyof typeof alertTypes]}
                -center">${renderToString(icons[type as keyof typeof icons]) + text} </div>`)
                }
                //add  line separator
                
                inBlockQuote = false
                blockQuoteContent = ''
                blockQuoteType = ''
            }
        }

        const parseInline = (text: string): string => {
          // Bold
            text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Italic
            text = text.replace(/\*(.*?)\*/g, '<em>$1</em>')
            // Underline
            text = text.replace(/__(.*?)__/g, '<u>$1</u>')
            // Image
            text = text.replace(/!\[(.*?)\]\((.*?)\)/g, '<img alt="$1" src="$2">')
            // Inline code
            text = text.replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 rounded">$1</code>')
            // Iframe
            text = text.replace(/<iframe.*?src=["']([^"']+)["'].*?><\/iframe>/g, `<iframe width="100%" height="${imageHeight}" src="$1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`)
            // Links with title (alias)
            text = text.replace(/\[(.*?)\]\((.*?)\)\((.*?)\)/g, '<a href="$2" title="$3" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">$1</a>')
            // Links without title
            text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">$1</a>')

            return text
        }

        const highlightCode = (code: string, language: string) => {
            const codeComponent = UseHighlighter({ content: code, lang: language, theme: theme })
            return `${codeComponent}`
        }

        const parseGitHubAlert = (line: string) => {
            const match = line.match(/>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/)
            if (match) {
                return match[1]
            }
            return null
        }

        let codeLines: string[] = []
        lines.forEach((line, index) => {
            if (line.trim().startsWith('```')) {
                flushParagraph()
                flushList()
                flushTable()
                flushBlockQuote()
                inCodeBlock = !inCodeBlock
                if (inCodeBlock) {
                    currentCodeLanguage = line.trim().slice(3).toLowerCase() || 'markdown'

                    if (CodeLanguageRemap[currentCodeLanguage.toLowerCase()]){
                      currentCodeLanguage = CodeLanguageRemap[currentCodeLanguage.toLowerCase()]
                    }

                    html += `<pre><code class="language-${currentCodeLanguage} ${codeBlockTheme} block p-2 rounded-md my-2 overflow-x-auto">`
                    codeLines = []
                } else {
                    html += '</code></pre>'
                    currentCodeLanguage = 'markdown'
                }
            } else if (inCodeBlock) {
              let prefix = (codeLines.length + 1)+ " | "
              if(currentCodeLanguage === 'markdown'){
                prefix = ""
              }

                html += highlightCode(line, currentCodeLanguage).replace(`<code`, `<span class="text-gray-400 dark:text-gray-500 text-sm">${prefix}</span><code`)
                codeLines.push(line)
            } else if (line.trim().startsWith('|') && line.includes('|')) {
                flushParagraph()
                flushList()
                flushBlockQuote()
                if (!inTable) {
                    inTable = true
                    if (line.includes('---')) {
                        return
                    }
                }
                if(!line.startsWith("|-")){

                  const cells = line.split('|').slice(1, -1).map(cell => cell.trim())
                  const row = cells.map(cell => `<td class="${tableCellClass}">${parseInline(cell)}</td>`).join('')
                  if (tableHeader === '') {
                      tableHeader = `<tr>${row}</tr>`
                  } else {
                      tableBody += `<tr>${row}</tr>`
                  }
                }
            } else if (line.trim().startsWith('>')) {
                flushParagraph()
                flushList()
                flushTable()
                if (!inBlockQuote) {
                    inBlockQuote = true
                    blockQuoteType = parseGitHubAlert(line) || 'DEFAULT'
                }
                blockQuoteContent += parseInline(line.slice(1).trim()) + ' '
                if (!line.includes('[!')) {
                    blockQuoteContent += '<br>'
                }
            } else if (line.trim().startsWith('$')) {
                //do math
                flushParagraph()
                flushList()
                flushTable()
                flushBlockQuote()
                const math = line.trim().slice(1)
                const tokens = tokenize(math)

                //html += `<div class="flex items-center justify-center my-4">${tokens.map((token, index) => (
                //    <MathToken key={index} token={token} />
                //))}</div>`
                //add a blockquote background to the math 
                let mathelements = tokens.map((token, index) => (
                    (<MathToken key={index} token={token} />)
        ));
                let renderedMath = mathelements.map((element) => renderToString(element)).join('')

                html += `<blockquote class="border-l-4 pl-4 py-2 my-4 bg-gray-100 dark:bg-gray-700">${renderedMath}</blockquote>`
        
        html += '<br>'
            }
            
            else {
                flushTable()
                flushBlockQuote()
                // Headers
                if (line.startsWith('#')) {
                    flushParagraph()
                    flushList()
                    const levelMatch = line.match(/^#+/)
                    if (levelMatch) {
                        const level = levelMatch[0].length
                        const text = line.replace(/^#+\s*/, '')
                        html += `<h${level} class="text-${4 - level}xl font-bold mt-${8 - level} mb-${6 - level}">${parseInline(text)}</h${level}>`
                    }
                }
                // Lists
                else if (/^\s*(\d+\.|-)\s+(.*)/.test(line)) {
                    flushParagraph()
                    const match = line.match(/^\s*(\d+\.|-)\s+(.*)/)
                    if (match) {
                        const isOrdered = match[1].endsWith('.')
                        if (!inList || (isOrdered && listType === 'ul') || (!isOrdered && listType === 'ol')) {
                            flushList()
                            listType = isOrdered ? 'ol' : 'ul'
                            html += `<${listType} class="list-${isOrdered ? 'decimal' : 'disc'} pl-5 my-2">`
                            inList = true
                        }
                        html += `<li>${parseInline(match[2])}</li>`
                    }
                }
                // Images
                else if (/!\[([^\]]*)\]$$([^)]+)(?:\s+(\d+)x(\d+))?$$/.test(line)) {
                    flushParagraph()
                    line = line.replace(/!\[([^\]]*)\]$$([^)]+)(?:\s+(\d+)x(\d+))?$$/g, (match, alt, src, width, height) => {
                        const sizeAttr = width && height ? `width="${width}" height="${height}"` : ''
                        return `<img src="${src}" alt="${alt}" ${sizeAttr} class="my-2 rounded-md max-w-full">`
                    })
                    html += line
                }
                // Horizontal Rule
                else if (/^(-{3,}|\*{3,})$/.test(line.trim())) {
                    flushParagraph()
                    flushList()
                    html += '<hr class="my-4 border-t border-gray-300 dark:border-gray-700">'
                }
                // Paragraphs
                else {
                    if (line.trim() === '') {
                        flushParagraph()
                    } else {
                        currentParagraph += parseInline(line) + ' '
                    }
                }
            }
        })

        flushParagraph()
        flushList()
        flushTable()
        flushBlockQuote()
        return html
    }

    return (
        <div
            className={`prose ${className}`}
            dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
        />
    )
}

export { SimpleMarkdown };

