require('dotenv').config();

const fs = require('fs');

const config = `// This file is auto-generated. DO NOT edit directly.
window.APP_CONFIG = {
    ADMIN_PASSWORD: "${process.env.ADMIN_PASSWORD}"
};`;

fs.writeFileSync('config.js', config);
console.log('Config file generated successfully!'); 