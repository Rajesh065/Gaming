import fs from 'fs';
import path from 'path';

function countLinesInDir(dir, extensions = ['.ts', '.tsx', '.js', '.jsx']) {
  let totalLines = 0;
  let fileCount = 0;

  function walk(current) {
    const files = fs.readdirSync(current);
    for (const file of files) {
      const fullPath = path.join(current, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        if (
          file === 'node_modules' ||
          file === '.git' ||
          file === 'dist' ||
          file === 'build' ||
          file === 'coverage' ||
          file === 'tests' ||
          file === 'scripts'
        ) {
          continue;
        }
        walk(fullPath);
      } else if (stat.isFile()) {
        const ext = path.extname(file);
        if (extensions.includes(ext) && !file.includes('.test.') && !file.includes('.spec.')) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          const lines = content.split('\n').length;
          totalLines += lines;
          fileCount++;
        }
      }
    }
  }

  walk(dir);
  return { totalLines, fileCount };
}

const stats = countLinesInDir('.');
console.log(`📊 Production Files: ${stats.fileCount}, Total Production LOC: ${stats.totalLines}`);
