const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorizedError');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET='secret' } = process.env;

// const SECRET_KEY = 'secret';

function generateToken(payload) {
  return jwt.sign(
    payload,
    NODE_ENV === 'production' ? JWT_SECRET : 'secret',
    { expiresIn: '7d' },
  );
}

function checkToken(token) {
  if (!token) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new UnauthorizedError('Необходима авторизация');
  }
}

module.exports = { generateToken, checkToken };
