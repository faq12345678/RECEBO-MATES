const fs = require('fs');
const path = 'c:/Users/atuse/OneDrive/Desktop/RECEBO MATES ESTRUCTURA/';

const fixLinks = (htmlPath) => {
    let content = fs.readFileSync(htmlPath, 'utf8');
    
    // Hardcoded replacements for index.html categories to ensure reliability
    if (htmlPath.includes('index.html')) {
        content = content.replace(/<a href="catalogo.html" class="category-card">([\s\S]*?)<h3>Mates<\/h3>/g, '<a href="catalogo.html?cat=mate" class="category-card"><h3>Mates</h3>');
        content = content.replace(/<a href="catalogo.html" class="category-card">([\s\S]*?)<h3>Termos<\/h3>/g, '<a href="catalogo.html?cat=termo" class="category-card"><h3>Termos</h3>');
        content = content.replace(/<a href="catalogo.html" class="category-card">([\s\S]*?)<h3>Bombillas<\/h3>/g, '<a href="catalogo.html?cat=bombilla" class="category-card"><h3>Bombillas</h3>');
        content = content.replace(/<a href="catalogo.html" class="category-card">([\s\S]*?)<h3>Yerbas<\/h3>/g, '<a href="catalogo.html?cat=yerba" class="category-card"><h3>Yerbas</h3>');
        content = content.replace(/<a href="catalogo.html" class="category-card">([\s\S]*?)<h3>Materas<\/h3>/g, '<a href="catalogo.html?cat=matera" class="category-card"><h3>Materas</h3>');
        content = content.replace(/<a href="catalogo.html" class="category-card">([\s\S]*?)<h3>Pavas<\/h3>/g, '<a href="catalogo.html?cat=pava" class="category-card"><h3>Pavas</h3>');
        content = content.replace(/<a href="catalogo.html" class="category-card">([\s\S]*?)<h3>Accesorios<\/h3>/g, '<a href="catalogo.html?cat=accesorio" class="category-card"><h3>Accesorios</h3>');
    }

    // TikTok icon replacement
    const tiktokRegex = /(<a href="https:\/\/www\.tiktok\.com\/@recebo\.mates"[^>]*>[\s\S]*?)<svg[^>]*>[\s\S]*?<\/svg>/g;
    content = content.replace(tiktokRegex, '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="footer__icon"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>');

    // WhatsApp numbers
    content = content.replace(/\+54 9 11 0128-3885/g, '+54 9 11 3885-0128');
    content = content.replace(/wa\.me\/5491101283885/g, 'wa.me/5491138850128');

    fs.writeFileSync(htmlPath, content, 'utf8');
};

['index.html', 'catalogo.html', 'nosotros.html', 'faq.html', 'contacto.html'].forEach(f => {
    if (fs.existsSync(path + f)) {
        fixLinks(path + f);
    }
});
console.log('HTML links fixed');
