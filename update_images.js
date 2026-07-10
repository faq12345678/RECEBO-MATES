const fs = require('fs');
const path = require('path');

const base = 'c:/Users/atuse/OneDrive/Desktop/RECEBO MATES ESTRUCTURA';
const jsPath = path.join(base, 'js/productos-data.js');
let jsContent = fs.readFileSync(jsPath, 'utf8');

// Correcciones especificas manuales
const fixes = {
    'yerba-baldo': 'IMG_1096.PNG',
    'yerba-canarias': 'images (27).jpeg',
    'yerba-canarias-especial': 'images (28).jpeg',
    'yerba-serena': 'images (29).jpeg',
    'yerba-te-verde': 'images (30).jpeg',
    'torpedo-acorazado': 'IMG_7362.jpeg' // Asumiendo que 7362 es la de cuerpo completo, si no 7421
};

// Expresion regular para extraer cada bloque de producto
const regex = /\{[\s\S]*?id:\s*['"]([^'"]+)['"][\s\S]*?\}/g;

let match;
let newContent = jsContent;

// Leer todas las carpetas del catalogo
const catalogDir = path.join(base, 'img/catalogo');
const getImages = (dirPath) => {
    if (!fs.existsSync(dirPath)) return [];
    return fs.readdirSync(dirPath)
        .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
        .map(f => f);
};

while ((match = regex.exec(jsContent)) !== null) {
    const block = match[0];
    const id = match[1];
    
    // Encontrar la carpeta de este producto leyendo el path de img principal
    const imgMatch = block.match(/(?:imagen|img|src):\s*['"](img\/catalogo\/([^/]+)\/[^'"]+)['"]/);
    if (!imgMatch) continue;
    
    const oldImgPath = imgMatch[1];
    const folderName = imgMatch[2];
    
    const folderPath = path.join(catalogDir, folderName);
    const allImages = getImages(folderPath);
    
    if (allImages.length > 0) {
        let mainImg = allImages[0];
        // Aplicar correccion si existe
        if (fixes[id] && allImages.includes(fixes[id])) {
            mainImg = fixes[id];
        } else if (id === 'torpedo-acorazado') {
            mainImg = 'IMG_7421.JPG'; // Forzar 7421 si 7362 no es la buena
        }
        
        // Poner mainImg primero, y el resto despues
        const imgs = [mainImg, ...allImages.filter(i => i !== mainImg)].map(i => 'img/catalogo/' + folderName + '/' + i);
        
        // Reemplazar la img principal
        let newBlock = block.replace(oldImgPath, imgs[0]);
        
        // Agregar array de imgs: [...] antes de "precio" o al final
        // Buscamos si ya tiene imgs: []
        if (newBlock.includes('imgs:')) {
            newBlock = newBlock.replace(/imgs:\s*\[[\s\S]*?\]/, 'imgs: ' + JSON.stringify(imgs.slice(1)).replace(/"/g, "'"));
        } else {
            newBlock = newBlock.replace(/(precio:)/, 'imgs: ' + JSON.stringify(imgs.slice(1)).replace(/"/g, "'") + ',\n    ');
        }
        
        newContent = newContent.replace(block, newBlock);
    }
}

fs.writeFileSync(jsPath, newContent, 'utf8');
console.log('Script Node.js finalizado con exito');
