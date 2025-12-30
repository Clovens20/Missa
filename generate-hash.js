const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'Manman198520@';
  const hash = await bcrypt.hash(password, 10);
  console.log('Hash bcrypt pour votre mot de passe:');
  console.log(hash);
}

generateHash();