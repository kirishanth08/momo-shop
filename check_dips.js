const fs = require('fs');
const cart = fs.readFileSync('cart.html', 'utf8');

const idx = cart.indexOf('Ghost Pepper Chutney');
console.log(cart.substring(idx - 400, idx + 1200));
