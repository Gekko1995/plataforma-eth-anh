const fs = require('fs');
const path = require('path');

const FILES = [
  'src/pages/modulos/modulo-1/LineaDiagnosticaPage.jsx',
  'src/pages/modulos/modulo-2/EvaluacionImpactoPage.jsx',
  'src/pages/modulos/modulo-3/GeoreferenciaPage.jsx',
  'src/pages/modulos/modulo-4/ClusterProductivoPage.jsx',
  'src/pages/modulos/modulo-5/RecaboCampoPage.jsx',
];

const root = path.join(__dirname, '..');

for (const rel of FILES) {
  const fp = path.join(root, rel);
  let src = fs.readFileSync(fp, 'utf8');
  let changed = false;

  // 1. Add import if missing
  if (!src.includes('ModuloInfoBanner')) {
    src = src.replace(
      "import { modulos } from '../../../data/modulos';",
      "import { modulos } from '../../../data/modulos';\nimport ModuloInfoBanner from '../../../components/ModuloInfoBanner';"
    );
    changed = true;
  }

  // 2. Replace the inline META banner block with <ModuloInfoBanner>
  // Pattern: {META && (<div style={{ background:COLOR+'0d', ...}}>...</div>)}
  // The block starts with `{META && (` and ends at the matching `)}` after the banner div
  // We use a regex that captures from `{META && (` through the closing `      )}` of that block
  const bannerRegex = /\{META && \(\s*<div style=\{\{[^}]*background:[^}]*COLOR[^}]*\}[^}]*\}\}[\s\S]*?<\/div>\s*\)\s*\)}/m;

  if (bannerRegex.test(src)) {
    src = src.replace(bannerRegex, '<ModuloInfoBanner meta={META} color={COLOR} />');
    changed = true;
  } else {
    // Try multiline approach - find `{META && (` ... `      )}` block
    const startIdx = src.indexOf('{META && (');
    if (startIdx !== -1) {
      // Find the matching closing `)}` by counting braces/parens from start
      let depth = 0;
      let i = startIdx;
      let inBlock = false;
      while (i < src.length) {
        if (src[i] === '{') { depth++; inBlock = true; }
        else if (src[i] === '}') { depth--; }
        if (inBlock && depth === 0) {
          const block = src.slice(startIdx, i + 1);
          src = src.slice(0, startIdx) + '<ModuloInfoBanner meta={META} color={COLOR} />' + src.slice(i + 1);
          changed = true;
          break;
        }
        i++;
      }
    }
  }

  if (changed) {
    fs.writeFileSync(fp, src, 'utf8');
    console.log('Updated:', rel);
  } else {
    console.log('No change:', rel);
  }
}
console.log('Done.');
