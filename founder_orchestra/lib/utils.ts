import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Custom, lightweight Markdown renderer to support structured insights.
 * Safely parses and converts markdown bold, lists, and tables into Tailwind-styled HTML.
 */
export function renderMarkdown(md: string): string {
  if (!md) return "";
  
  // Normalize line endings
  let html = md.replace(/\r\n/g, "\n");
  
  // 1. Process Markdown Tables
  const lines = html.split("\n");
  let inTable = false;
  let tableRows: string[] = [];
  let processedLines: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith("|") && line.endsWith("|")) {
      if (!inTable) {
        inTable = true;
        tableRows = [];
      }
      tableRows.push(line);
    } else {
      if (inTable) {
        // Render the table
        processedLines.push(renderHtmlTable(tableRows));
        inTable = false;
      }
      processedLines.push(lines[i]);
    }
  }
  if (inTable) {
    processedLines.push(renderHtmlTable(tableRows));
  }
  
  html = processedLines.join("\n");
  
  // 2. Bold text **bold** -> <strong>bold</strong>
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  
  // 3. Bullet points: lines starting with "- " or "* " or "• "
  html = html.replace(/^\s*[-*•]\s+(.*)$/gm, "<li>$1</li>");
  // Wrap consecutive <li> elements in <ul>
  html = html.replace(/(<li>.*<\/li>)+/g, (match) => `<ul class="list-disc pl-5 my-2 space-y-1">${match}</ul>`);
  
  // 4. Line breaks
  html = html.replace(/\n\n/g, "<br /><br />");
  html = html.replace(/\n/g, "<br />");
  
  return html;
}

function renderHtmlTable(rows: string[]): string {
  if (rows.length === 0) return "";
  
  // Filter out the separator row (e.g. |---|---|)
  const cleanRows = rows.filter(r => !r.trim().match(/^\|\s*[-:]+[-|:\s]*\|$/));
  if (cleanRows.length === 0) return "";
  
  let tableHtml = `<div class="overflow-x-auto my-3"><table class="w-full text-left border-collapse text-xs border border-border rounded-lg overflow-hidden">`;
  
  cleanRows.forEach((row, index) => {
    // Split columns and remove first/last empty elements from leading/trailing pipe
    const cols = row.split("|").slice(1, -1).map(c => c.trim());
    
    if (index === 0) {
      tableHtml += `<thead class="bg-[rgba(255,255,255,0.03)] border-b border-border"><tr>`;
      cols.forEach(col => {
        tableHtml += `<th class="px-3 py-2 font-semibold text-fo-muted uppercase tracking-[0.5px]">${col}</th>`;
      });
      tableHtml += `</tr></thead><tbody>`;
    } else {
      tableHtml += `<tr class="border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.01)]">`;
      cols.forEach(col => {
        tableHtml += `<td class="px-3 py-2 text-fo-sub">${col}</td>`;
      });
      tableHtml += `</tr>`;
    }
  });
  
  tableHtml += `</tbody></table></div>`;
  return tableHtml;
}
