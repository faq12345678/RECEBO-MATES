const fs = require('fs');
const jsPath = 'c:/Users/atuse/OneDrive/Desktop/RECEBO MATES ESTRUCTURA/js/productos-data.js';
let content = fs.readFileSync(jsPath, 'utf8');

// evaluate it to see what we get
try {
    eval(content);
    console.log('PRODUCTOS is an array?', Array.isArray(PRODUCTOS));
    console.log('PRODUCTOS length:', PRODUCTOS.length);
    if (PRODUCTOS.length > 0) {
        console.log('First product ID:', PRODUCTOS[0].id);
        const torpedoPlata = PRODUCTOS.find(p => p.id === 'torpedo-plata');
        console.log('torpedo-plata exists?', torpedoPlata ? 'yes' : 'no');
    }
} catch (e) {
    console.error('Error parsing JS:', e.message);
}
