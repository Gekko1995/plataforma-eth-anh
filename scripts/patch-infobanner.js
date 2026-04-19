/**
 * Reemplaza la función InfoBanner local de cada página de módulo
 * por el componente compartido ModuloInfoBanner.
 *
 * Cambios por archivo:
 *  1. Añade import ModuloInfoBanner
 *  2. Elimina function InfoBanner() { ... }
 *  3. Reemplaza <InfoBanner /> por <ModuloInfoBanner meta={META} color={COLOR} />
 */

const fs   = require('fs');
const path = require('path');
const glob = require('glob').sync || (() => {
  const { execSync } = require('child_process');
  return (pattern) =>
    execSync(`find ${pattern.replace('/**/', '/').replace('*.jsx','')} -name "*.jsx"`)
      .toString().trim().split('\n').filter(Boolean);
});

const pagesDir = path.join(__dirname, '../src/pages/modulos');
const files = fs.readdirSync(pagesDir, { recursive: true })
  .filter(f => f.endsWith('.jsx'))
  .map(f => path.join(pagesDir, f));

let changed = 0;

for (const file of files) {
  let src = fs.readFileSync(file, 'utf8');
  if (!src.includes('function InfoBanner()')) continue;

  // 1. Add import after last existing import line
  if (!src.includes('ModuloInfoBanner')) {
    src = src.replace(
      /^(import .+from .+;\n)(?!import)/m,
      (match) => match + "import ModuloInfoBanner from '../../../components/ModuloInfoBanner';\n"
    );
    // fallback: insert before first non-import line
    if (!src.includes('ModuloInfoBanner')) {
      src = "import ModuloInfoBanner from '../../../components/ModuloInfoBanner';\n" + src;
    }
  }

  // 2. Remove entire function InfoBanner() { ... } block
  // The function ends at the matching closing brace followed by blank line or next function
  src = src.replace(/\nfunction InfoBanner\(\)[^]*?\n\}\n/g, '\n');

  // 3. Replace <InfoBanner /> with shared component
  src = src.replace(/<InfoBanner \/>/g, '<ModuloInfoBanner meta={META} color={COLOR} />');

  fs.writeFileSync(file, src);
  changed++;
  console.log(`✓  ${path.relative(process.cwd(), file)}`);
}

console.log(`\nDone — ${changed} files updated.`);
