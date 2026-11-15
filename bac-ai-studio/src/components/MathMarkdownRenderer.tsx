'use client';

import React, { useMemo } from 'react';
import katex from 'katex';
import { Copy, Check, Terminal } from 'lucide-react';

interface MathMarkdownRendererProps {
  content: string;
  className?: string;
}

export const MathMarkdownRenderer: React.FC<MathMarkdownRendererProps> = ({ content, className = '' }) => {
  const [copiedIdx, setCopiedIdx] = React.useState<number | null>(null);

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2500);
  };

  // Safe Math, Markdown, Table & Pseudocode Tokenizer
  const renderedElements = useMemo(() => {
    if (!content) return null;

    // Helper: Render inline formatting (KaTeX math, bold, code, regular text)
    const renderInlineElements = (text: string, inlineKey: string): React.ReactNode[] => {
      const tokens = text.split(/(\$\$[\s\S]+?\$\$|\$[^\$\n]+?\$|`[^`]+`|\*\*[^*]+\*\*)/g);

      return tokens.map((tok, tIdx) => {
        const k = `${inlineKey}-${tIdx}`;
        if (tok.startsWith('$$') && tok.endsWith('$$')) {
          const mathExpr = tok.slice(2, -2).trim();
          try {
            const html = katex.renderToString(mathExpr, { displayMode: true, throwOnError: false });
            return (
              <span 
                key={k} 
                dir="ltr"
                className="block my-2 overflow-x-auto text-center font-mono text-[#1E3A8A]"
                dangerouslySetInnerHTML={{ __html: html }} 
              />
            );
          } catch {
            return <code key={k} className="block my-2 text-rose-600 font-mono text-center">{tok}</code>;
          }
        } else if (tok.startsWith('$') && tok.endsWith('$') && tok.length > 2) {
          const mathExpr = tok.slice(1, -1).trim();
          try {
            const html = katex.renderToString(mathExpr, { displayMode: false, throwOnError: false });
            return (
              <span 
                key={k} 
                dir="ltr"
                className="inline-block px-1 align-baseline text-[#1E3A8A] font-medium"
                dangerouslySetInnerHTML={{ __html: html }} 
              />
            );
          } catch {
            return <code key={k} className="text-rose-600 font-mono px-1">{tok}</code>;
          }
        } else if (tok.startsWith('`') && tok.endsWith('`') && tok.length > 2) {
          return (
            <code key={k} className="px-1.5 py-0.5 rounded bg-[#F1F5F9] border border-[#CBD5E1] text-[#0F766E] font-mono text-[11px] font-semibold">
              {tok.slice(1, -1)}
            </code>
          );
        } else if (tok.startsWith('**') && tok.endsWith('**') && tok.length > 4) {
          return (
            <strong key={k} className="font-bold text-[#14243A]">
              {tok.slice(2, -2)}
            </strong>
          );
        }
        return <span key={k}>{tok}</span>;
      });
    };

    // Render paragraphs, tables, callouts, and lists
    const renderTextSegments = (textSegment: string, keyPrefix: string): React.ReactNode[] => {
      const paragraphs = textSegment.split(/\n\n+/);

      return paragraphs.map((para, pIdx) => {
        const trimmed = para.trim();
        if (!trimmed) return null;

        const lines = trimmed.split('\n');

        // 1. Markdown Tables (| header | header | ... )
        if (lines.length >= 2 && lines[0].includes('|') && lines[1].includes('---')) {
          const headerCells = lines[0].split('|').map(c => c.trim()).filter((_, i, arr) => i > 0 && i < arr.length - 1);
          const bodyRows = lines.slice(2).filter(l => l.includes('|')).map(l => 
            l.split('|').map(c => c.trim()).filter((_, i, arr) => i > 0 && i < arr.length - 1)
          );

          return (
            <div key={`${keyPrefix}-tbl-${pIdx}`} className="my-3 overflow-x-auto rounded-lg border border-[#E5E9EF] bg-white shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#F8FAFC] border-b border-[#E5E9EF] text-[#14243A] font-semibold">
                  <tr>
                    {headerCells.map((hc, hIdx) => (
                      <th key={hIdx} className="px-3.5 py-2.5 font-bold tracking-wider">{renderInlineElements(hc, `th-${pIdx}-${hIdx}`)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E9EF] text-[#334155]">
                  {bodyRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-[#F8FAFC] transition-colors">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="px-3.5 py-2 font-mono text-[11px] leading-relaxed">{renderInlineElements(cell, `td-${pIdx}-${rIdx}-${cIdx}`)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        // 2. Callout Blocks (> [!NOTE], > [!CAUTION], > [!TIP], > blockquote)
        if (trimmed.startsWith('>')) {
          const cleanText = trimmed.replace(/^>\s*/gm, '');
          const isCaution = cleanText.includes('[!CAUTION]') || cleanText.includes('[!WARNING]');
          const isTip = cleanText.includes('[!TIP]');
          const displayText = cleanText.replace(/\[!(NOTE|CAUTION|WARNING|TIP|IMPORTANT)\]/g, '').trim();

          return (
            <div 
              key={`${keyPrefix}-callout-${pIdx}`} 
              className={`my-3 p-3.5 rounded-lg border text-xs leading-relaxed ${
                isCaution 
                  ? 'bg-rose-50 border-rose-200 text-rose-800' 
                  : isTip
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-blue-50 border-blue-200 text-[#1E3A8A]'
              }`}
            >
              {renderInlineElements(displayText, `callout-${pIdx}`)}
            </div>
          );
        }

        // 3. Headings (#, ##, ###)
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={`${keyPrefix}-h3-${pIdx}`} className="text-sm font-bold text-[#14243A] mt-4 mb-2 flex items-center gap-2">
              {renderInlineElements(trimmed.replace(/^###\s+/, ''), `h3-${pIdx}`)}
            </h3>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={`${keyPrefix}-h2-${pIdx}`} className="text-base font-extrabold text-[#14243A] mt-5 mb-2 pb-1 border-b border-[#E5E9EF]">
              {renderInlineElements(trimmed.replace(/^##\s+/, ''), `h2-${pIdx}`)}
            </h2>
          );
        }
        if (trimmed.startsWith('# ')) {
          return (
            <h1 key={`${keyPrefix}-h1-${pIdx}`} className="text-lg font-black text-[#14243A] mt-6 mb-3">
              {renderInlineElements(trimmed.replace(/^#\s+/, ''), `h1-${pIdx}`)}
            </h1>
          );
        }

        // 4. Bullet lists
        if (lines.length > 1 && lines.every(l => l.trim().startsWith('- ') || l.trim().startsWith('* ') || l.trim() === '')) {
          return (
            <ul key={`${keyPrefix}-ul-${pIdx}`} className="list-disc list-inside space-y-1 my-2 text-[#475569] pl-2 text-xs">
              {lines.filter(l => l.trim().length > 0).map((item, iIdx) => (
                <li key={iIdx}>
                  {renderInlineElements(item.replace(/^[-*]\s+/, ''), `li-${pIdx}-${iIdx}`)}
                </li>
              ))}
            </ul>
          );
        }

        // 5. Standard Paragraph with Arabic RTL / French LTR detection
        const isArabic = /[\u0600-\u06FF]/.test(trimmed);

        return (
          <p 
            key={`${keyPrefix}-p-${pIdx}`} 
            dir={isArabic ? 'rtl' : 'ltr'}
            className={`mb-2 leading-relaxed text-[#202B38] ${isArabic ? 'font-arabic text-right' : 'text-left'}`}
          >
            {renderInlineElements(trimmed, `p-${pIdx}`)}
          </p>
        );
      });
    };

    // Split by code blocks first
    const codeBlockRegex = /```([a-zA-Z0-9]*)\n([\s\S]*?)```/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let codeIndex = 0;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        const textBefore = content.substring(lastIndex, match.index);
        parts.push(...renderTextSegments(textBefore, `text-${lastIndex}`));
      }

      const rawLang = match[1] || 'python';
      const lang = rawLang.toLowerCase();
      const code = match[2];
      const currentCodeIdx = codeIndex++;
      const isAlgo = lang === 'algo' || lang === 'pseudocode' || lang === 'algorithme';

      parts.push(
        <div key={`code-${match.index}`} dir="ltr" className="my-3 rounded-lg overflow-hidden border border-[#1E293B] bg-[#0F172A] text-left shadow-xs">
          <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#1E293B] border-b border-[#334155] text-[11px] text-[#94A3B8]">
            <div className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span className={`font-mono uppercase font-semibold ${isAlgo ? 'text-amber-400' : 'text-[#38BDF8]'}`}>
                {isAlgo ? 'Algorithme Conventionnel' : lang}
              </span>
            </div>
            <button
              onClick={() => handleCopyCode(code, currentCodeIdx)}
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer text-[#94A3B8]"
              title="Copier le code"
            >
              {copiedIdx === currentCodeIdx ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copié</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copier</span>
                </>
              )}
            </button>
          </div>
          <pre className={`p-3.5 text-xs font-mono overflow-x-auto leading-relaxed ${isAlgo ? 'text-amber-200 bg-[#0B1120]' : 'text-[#34D399]'}`}>
            <code>{code}</code>
          </pre>
        </div>
      );

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      const remainingText = content.substring(lastIndex);
      parts.push(...renderTextSegments(remainingText, `text-${lastIndex}`));
    }

    return parts;
  }, [content, copiedIdx]);

  return <div className={`math-markdown-content text-[#202B38] text-xs ${className}`}>{renderedElements}</div>;
};