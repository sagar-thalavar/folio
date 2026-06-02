import React from 'react';

/**
 * A lightweight custom Markdown parser that renders basic HTML elements from a string.
 * Supports:
 * - Code blocks (```code```)
 * - Inline code (`code`)
 * - Headers (###, ##, #)
 * - Bold text (**text**)
 * - Unordered lists (- item)
 * - Links ([text](url))
 * - Paragraphs (split by double newlines)
 */
export const renderMarkdown = (text: string): React.ReactNode => {
  if (!text) return null;

  // 1. Parse code blocks first to protect them from standard line parsing
  const codeBlockRegex = /```([\s\S]*?)```/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    // Add text before the code block
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.substring(lastIndex, match.index) });
    }
    // Add code block content
    parts.push({ type: 'codeblock', content: match[1].trim() });
    lastIndex = codeBlockRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.substring(lastIndex) });
  }

  // Helper to parse inline styles: bold, inline code, and links
  const parseInline = (lineText: string): React.ReactNode[] => {
    // We match links: [text](url), bold: **text**, and inline code: `code`
    const inlineRegex = /(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g;
    const lineParts = lineText.split(inlineRegex);

    return lineParts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={idx} className="inline-code">{part.slice(1, -1)}</code>;
      }
      if (part.startsWith('[') && part.includes('](')) {
        const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
        if (linkMatch) {
          const [, linkText, linkUrl] = linkMatch;
          // Determine if link is external or internal
          const isExternal = linkUrl.startsWith('http');
          return (
            <a
              key={idx}
              href={linkUrl}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              className="md-link"
            >
              {linkText}
            </a>
          );
        }
      }
      return part;
    });
  };

  // 2. Render each part
  return parts.map((part, index) => {
    if (part.type === 'codeblock') {
      return (
        <pre key={index} className="md-code-block">
          <code>{part.content}</code>
        </pre>
      );
    }

    // Process blocks of text (paragraphs, headers, lists)
    const blocks = part.content.split(/\n\s*\n/);
    return blocks.map((block, bIdx) => {
      const trimmedBlock = block.trim();
      if (!trimmedBlock) return null;

      // Check for headers
      if (trimmedBlock.startsWith('### ')) {
        return <h4 key={`b-${bIdx}`}>{parseInline(trimmedBlock.substring(4))}</h4>;
      }
      if (trimmedBlock.startsWith('## ')) {
        return <h3 key={`b-${bIdx}`}>{parseInline(trimmedBlock.substring(3))}</h3>;
      }
      if (trimmedBlock.startsWith('# ')) {
        return <h2 key={`b-${bIdx}`}>{parseInline(trimmedBlock.substring(2))}</h2>;
      }

      // Check for lists
      if (trimmedBlock.startsWith('- ') || trimmedBlock.startsWith('* ')) {
        const items = trimmedBlock.split(/\n[-*]\s+/);
        // Fix first item prefix
        items[0] = items[0].replace(/^[-*]\s+/, '');
        return (
          <ul key={`b-${bIdx}`} className="md-list">
            {items.map((item, iIdx) => (
              <li key={iIdx}>{parseInline(item.trim())}</li>
            ))}
          </ul>
        );
      }

      // Default paragraph (split by newlines to preserve simple breaks if any)
      const lines = trimmedBlock.split('\n');
      return (
        <p key={`b-${bIdx}`} className="md-paragraph">
          {lines.map((line, lIdx) => (
            <React.Fragment key={lIdx}>
              {lIdx > 0 && <br />}
              {parseInline(line)}
            </React.Fragment>
          ))}
        </p>
      );
    });
  });
};
