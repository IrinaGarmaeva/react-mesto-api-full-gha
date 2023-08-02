const { checkToken } = require('../utils/utils');
const UnauthorizedError = require('../errors/unauthorizedError');

function checkAuth(req, res, next) {
  const token = req.cookies.jwt;

  if (!token) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  let payload;
  try {
    payload = checkToken(token);
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  req.user = payload;
  return next();
}

module.exports = { checkAuth };
