const fs = require('fs');
const jsPath = 'c:/Users/atuse/OneDrive/Desktop/RECEBO MATES ESTRUCTURA/js/productos-data.js';
let content = fs.readFileSync(jsPath, 'utf8');
const products = [];
const seenIds = new Set();
const regex = /\{\s*id:\s*'([^']+)'[\s\S]*?waMsg:\s*'[^']*'\s*\}/g;
let match;
while ((match = regex.exec(content)) !== null) {
    const id = match[1];
    if (!seenIds.has(id)) {
        seenIds.add(id);
        products.push(match[0]);
    }
}
console.log('Total unique products found:', products.length);
if (products.length > 0) {
    let newContent = 'const RECEBO_WA = "5491101283885";\n\nconst PRODUCTOS = [\n';
    newContent += products.join(',\n');
    newContent += '\n];\n';
    fs.writeFileSync(jsPath, newContent, 'utf8');
    console.log('File restored successfully!');
}
