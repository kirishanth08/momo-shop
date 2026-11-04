const fs = require('fs');
const html = fs.readFileSync('contact.html', 'utf8');

const fIdx = html.indexOf('<form');
console.log(html.substring(fIdx, fIdx + 2000));
