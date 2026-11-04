const fs = require('fs');
const css = fs.readFileSync('style.css', 'utf8');

const idx = css.indexOf('.hygiene-icon');
console.log(css.substring(idx, idx + 600));
