import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');
const htmlPath = path.join(distDir, 'index.html');

let html = fs.readFileSync(htmlPath, 'utf8');

// Match the Vite-injected CSS link tag
const cssLinkRegex = /<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/;
const match = html.match(cssLinkRegex);

if (match) {
  const cssUrl = match[1];
  const cssPath = path.join(distDir, cssUrl.startsWith('/') ? cssUrl.slice(1) : cssUrl);
  
  if (fs.existsSync(cssPath)) {
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    // Replace the link tag with the inline style tag
    html = html.replace(match[0], `<style>${cssContent}</style>`);
    fs.writeFileSync(htmlPath, html, 'utf8');
    console.log(`Successfully inlined CSS from ${cssUrl}!`);
  } else {
    console.warn(`CSS file not found at: ${cssPath}`);
  }
} else {
  console.warn('No CSS link tag found to inline.');
}
