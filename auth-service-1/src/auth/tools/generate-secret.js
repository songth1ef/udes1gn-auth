const crypto = require('crypto');

// 生成 JWT_SECRET_KEY
const jwtSecretKey = crypto.randomBytes(32).toString('hex');
console.log('Generated JWT_SECRET_KEY:', jwtSecretKey);

// 生成 SESSION_SECRET
const sessionSecret = crypto.randomBytes(32).toString('hex');
console.log('Generated SESSION_SECRET:', sessionSecret);
