const crypto = require('crypto');
const fs = require('fs');

function generateKeyPair() {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
        }
    });

    fs.writeFileSync('private_key.pem', privateKey);
    fs.writeFileSync('public_key.pem', publicKey);

    console.log('RSA key pair has been generated.');
    console.log('Private key saved to private_key.pem');
    console.log('Public key saved to public_key.pem');
}

generateKeyPair();