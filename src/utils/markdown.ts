export const markdownToHtml = (markdown: string): string => {
  let html = markdown;

  // Convert headings (h1-h6) - very basic, matches only start of line
  html = html.replace(/^###### (.*$)/gim, '<h6 class="text-sm font-bold mt-4 mb-2 text-forest-800">$1</h6>');
  html = html.replace(/^##### (.*$)/gim, '<h5 class="text-base font-bold mt-4 mb-2 text-forest-800">$1</h5>');
  html = html.replace(/^#### (.*$)/gim, '<h4 class="text-lg font-bold mt-4 mb-2 text-forest-800">$1</h4>');
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-4 mb-2 text-forest-800">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-4 mb-2 text-forest-800">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-4 mb-2 text-forest-800">$1</h1>');

  // Convert bold (**text** or __text__)
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-forest-900">$1</strong>');
  html = html.replace(/__(.*?)__/g, '<strong class="font-semibold text-forest-900">$1</strong>');

  // Convert italics (*text* or _text_)
  html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
  html = html.replace(/_(.*?)_/g, '<em class="italic">$1</em>');

  // Convert links [text](url)
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-forest-700 hover:text-forest-900 underline">$1</a>');

  // Convert code blocks ```code```
  html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-forest-50 border border-forest-200 p-3 rounded-lg overflow-x-auto my-2"><code class="text-sm text-forest-800">$1</code></pre>');

  // Convert inline code `code`
  html = html.replace(/`([^`]+)`/g, '<code class="bg-forest-100 px-1 py-0.5 rounded text-sm text-forest-800">$1</code>');

  // Convert unordered lists (* item or - item)
  const listItems = html.match(/^\s*[\*-]\s+(.*)$/gim);
  if (listItems) {
    const listContent = listItems.map(item => 
      item.replace(/^\s*[\*-]\s+(.*)$/gim, '<li class="ml-4">$1</li>')
    ).join('');
    html = html.replace(/^\s*[\*-]\s+.*$/gim, '');
    html += `<ul class="list-disc list-inside my-2 space-y-1">${listContent}</ul>`;
  }

  // Convert ordered lists (1. item)
  const orderedListItems = html.match(/^\s*\d+\.\s+(.*)$/gim);
  if (orderedListItems) {
    const orderedListContent = orderedListItems.map(item => 
      item.replace(/^\s*\d+\.\s+(.*)$/gim, '<li class="ml-4">$1</li>')
    ).join('');
    html = html.replace(/^\s*\d+\.\s+.*$/gim, '');
    html += `<ol class="list-decimal list-inside my-2 space-y-1">${orderedListContent}</ol>`;
  }

  // Convert line breaks
  html = html.replace(/\n\n/g, '</p><p class="mb-2">');
  html = html.replace(/\n/g, '<br>');

  // Wrap in paragraph if not already wrapped
  if (!html.startsWith('<')) {
    html = `<p class="mb-2">${html}</p>`;
  }

  return html;
};