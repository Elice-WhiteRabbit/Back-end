const crypto = require('crypto');

module.exports = () => {
  const length = 6;
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomCode = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(charset.length);
    randomCode += charset.charAt(randomIndex);
  }

  return randomCode;
}