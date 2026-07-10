const fs = require('fs');
const path = 'c:/Users/atuse/OneDrive/Desktop/RECEBO MATES ESTRUCTURA/css/pages/index.css';
let content = fs.readFileSync(path, 'utf8');

const newCSS = 
/* Testimonials Screenshots Grid */
.testimonials__screenshots-grid {
  display: flex;
  gap: var(--space-6);
  overflow-x: auto;
  padding-bottom: var(--space-4);
  scrollbar-width: thin;
  scrollbar-color: var(--color-warm) transparent;
}

.testimonials__screenshots-grid::-webkit-scrollbar {
  height: 8px;
}
.testimonials__screenshots-grid::-webkit-scrollbar-track {
  background: transparent;
}
.testimonials__screenshots-grid::-webkit-scrollbar-thumb {
  background-color: var(--color-warm);
  border-radius: var(--radius-full);
}

.testimonial-screenshot-wrap {
  flex: 0 0 auto;
  width: 280px;
  height: 500px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  background-color: var(--color-ivory-alt);
  border: 1px solid var(--color-border);
}

.testimonial-screenshot {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

@media (max-width: 768px) {
  .testimonial-screenshot-wrap {
    width: 240px;
    height: 420px;
  }
}
;

// Just append the new CSS if it doesn't exist
if (!content.includes('testimonials__screenshots-grid')) {
    fs.writeFileSync(path, content + '\n' + newCSS, 'utf8');
    console.log('CSS updated');
} else {
    console.log('CSS already has the classes');
}
