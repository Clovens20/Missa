const bcrypt = require('bcryptjs');

const password = 'Manman198520@';

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Erreur:', err);
  } else {
    console.log('Hash:');
    console.log(hash);
  }
});