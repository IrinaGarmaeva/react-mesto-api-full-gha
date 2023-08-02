const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorizedError');

const SECRET_KEY = 'secret';

function generateToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '7d' });
}

function checkToken(token) {
  if (!token) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    console.log('не прошла авторизация');
    throw new UnauthorizedError('Необходима авторизация');
  }
}

module.exports = { generateToken, checkToken };
