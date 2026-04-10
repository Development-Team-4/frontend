export const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const inlineMarkdownToHtml = (line: string) => {
  let result = escapeHtml(line);

  result = result.replace(
    /!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/g,
    '<img src="$2" alt="$1" class="my-2 max-h-80 max-w-full rounded-md border border-border object-contain" />',
  );
  result = result.replace(
    /`([^`]+)`/g,
    '<code class="rounded bg-muted px-1 py-0.5 text-xs">$1</code>',
  );
  result = result.replace(/~~([^~]+)~~/g, '<del>$1</del>');
  result = result.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  result = result.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  result = result.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noreferrer" class="text-primary underline">$1</a>',
  );
  result = result.replace(
    /(^|\s)(https?:\/\/[^\s<]+)/g,
    '$1<a href="$2" target="_blank" rel="noreferrer" class="text-primary underline">$2</a>',
  );

  return result;
};

export const markdownToHtml = (markdown: string) => {
  const lines = markdown.replaceAll('\r\n', '\n').split('\n');
  const html: string[] = [];
  let inCodeBlock = false;
  let listType: 'ul' | 'ol' | null = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        if (listType) {
          html.push(`</${listType}>`);
          listType = null;
        }
        const lang = line.slice(3).trim();
        const langLabel = lang
          ? `<div class="mb-2 text-[11px] uppercase text-muted-foreground">${escapeHtml(lang)}</div>`
          : '';
        html.push(
          `<pre class="overflow-x-auto rounded-lg bg-muted p-3 text-xs">${langLabel}<code>`,
        );
        inCodeBlock = true;
      } else {
        html.push('</code></pre>');
        inCodeBlock = false;
      }
      continue;
    }

    if (inCodeBlock) {
      html.push(`${escapeHtml(rawLine)}\n`);
      continue;
    }

    if (!line) {
      if (listType) {
        html.push(`</${listType}>`);
        listType = null;
      }
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      if (listType) {
        html.push(`</${listType}>`);
        listType = null;
      }
      const level = headingMatch[1].length;
      const text = inlineMarkdownToHtml(headingMatch[2]);
      html.push(
        `<h${level} class="mt-2 mb-1 font-semibold">${text}</h${level}>`,
      );
      continue;
    }

    const unorderedListMatch = line.match(/^[-*]\s+(.+)$/);
    if (unorderedListMatch) {
      if (listType !== 'ul') {
        if (listType) {
          html.push(`</${listType}>`);
        }
        html.push('<ul class="mb-2 ml-5 list-disc">');
        listType = 'ul';
      }
      html.push(`<li>${inlineMarkdownToHtml(unorderedListMatch[1])}</li>`);
      continue;
    }

    const orderedListMatch = line.match(/^\d+\.\s+(.+)$/);
    if (orderedListMatch) {
      if (listType !== 'ol') {
        if (listType) {
          html.push(`</${listType}>`);
        }
        html.push('<ol class="mb-2 ml-5 list-decimal">');
        listType = 'ol';
      }
      html.push(`<li>${inlineMarkdownToHtml(orderedListMatch[1])}</li>`);
      continue;
    }

    if (listType) {
      html.push(`</${listType}>`);
      listType = null;
    }

    if (line.startsWith('> ')) {
      html.push(
        `<blockquote class="my-2 border-l-2 border-border pl-3 text-muted-foreground">${inlineMarkdownToHtml(
          line.slice(2),
        )}</blockquote>`,
      );
      continue;
    }

    html.push(`<p class="mb-2">${inlineMarkdownToHtml(line)}</p>`);
  }

  if (listType) {
    html.push(`</${listType}>`);
  }
  if (inCodeBlock) {
    html.push('</code></pre>');
  }

  return html.join('');
};
