const crypto = require('crypto');

/**
 * JWT Secret Generator
 * Generates a secure random secret key for JWT token signing
 */

function generateJWTSecret(length = 64) {
    // Generate random bytes and convert to base64
    const secret = crypto.randomBytes(length).toString('base64');
    return secret;
}

function generateMultipleSecrets(count = 3, length = 64) {
    console.log('🔐 JWT Secret Generator\n');
    console.log(`Generating ${count} secure JWT secrets (${length} bytes each):\n`);

    for (let i = 1; i <= count; i++) {
        const secret = generateJWTSecret(length);
        console.log(`Secret ${i}:`);
        console.log(secret);
        console.log('');
    }

    console.log('💡 Usage in .env file:');
    console.log('JWT_SECRET=' + generateJWTSecret(length));
    console.log('\n✅ Copy one of the secrets above to your .env file');
}

// Run the generator
generateMultipleSecrets();
