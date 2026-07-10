const fs = require('fs');
const path = 'c:/Users/atuse/OneDrive/Desktop/RECEBO MATES ESTRUCTURA/index.html';
let content = fs.readFileSync(path, 'utf8');

const tiktokRegex = /(<a href="https:\/\/www\.tiktok\.com\/@recebo\.mates"[^>]*>[\s\S]*?)<svg[^>]*>[\s\S]*?<\/svg>/;
content = content.replace(tiktokRegex, '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="footer__icon"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>');

const screenshots = [
  'Screenshot_20260624_193115_Instagram.jpg',
  'Screenshot_20260624_193151_Instagram.jpg',
  'Screenshot_20260624_193157_Instagram.jpg',
  'Screenshot_20260624_193210_Instagram.jpg',
  'Screenshot_20260624_193314_WhatsApp.jpg',
  'Screenshot_20260624_193327_WhatsApp.jpg',
  'Screenshot_20260624_193444_WhatsApp.jpg',
  'Screenshot_20260624_193818_WhatsApp.jpg',
  'Screenshot_20260624_193909_Instagram.jpg',
  'Screenshot_20260624_193944_Instagram.jpg'
];

let screenshotsHtml = '<div class="testimonials__screenshots-grid">\n';
screenshots.forEach(src => {
  const imgUrl = 'img/Rese%C3%B1as%20y%20Testimonios/Rese%C3%B1as%20y%20Testimonios/' + src;
  screenshotsHtml += '  <div class="testimonial-screenshot-wrap"><img src="' + imgUrl + '" alt="Reseña de cliente" class="testimonial-screenshot" loading="lazy"></div>\n';
});
screenshotsHtml += '</div>';

content = content.replace(/<div class="testimonials__grid">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/, screenshotsHtml + '\n    </div>\n  </section>');

fs.writeFileSync(path, content, 'utf8');
console.log('Index HTML successfully updated.');
