const fs = require('fs');
const js = fs.readFileSync('main.js', 'utf8');

const fIdx = js.indexOf('filter-pill-btn');
if (fIdx !== -1) {
  console.log(js.substring(fIdx - 100, fIdx + 500));
} else {
  console.log('not found');
}

