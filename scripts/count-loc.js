import fs from 'fs';
import path from 'path';

function getFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (!['node_modules', 'dist', 'build', '.git', 'coverage', 'tests', 'test'].includes(file)) {
        getFiles(filePath, fileList);
      }
    } else if (/\.(ts|tsx|js|jsx)$/.test(file) && !/\.test\./.test(file)) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const dirs = ['packages', 'apps'];
let totalLines = 0;
let fileCount = 0;

for (const d of dirs) {
  if (fs.existsSync(d)) {
    const files = getFiles(d);
    for (const f of files) {
      const content = fs.readFileSync(f, 'utf-8');
      const lines = content.split('\n').length;
      totalLines += lines;
      fileCount++;
    }
  }
}

console.log(`📊 Production Files: ${fileCount}, Total Production LOC: ${totalLines}`);
