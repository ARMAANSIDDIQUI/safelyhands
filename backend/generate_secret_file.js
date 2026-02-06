const crypto = require('crypto');
const fs = require('fs');
const secret = crypto.randomBytes(64).toString('hex');
fs.writeFileSync('jwt_secret.txt', secret);
console.log('Secret written to jwt_secret.txt');
