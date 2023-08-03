const router = require('express').Router();
const { checkAuth } = require('../middlewares/auth');

const loginRoute = require('./login');
const signUpRoute = require('./createUser');
const signOutRoute = require('./signout');
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const NotFoundError = require('../errors/notFoundError');

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
router.use('/', loginRoute);
router.use('/', signUpRoute);

router.use(checkAuth);
router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
router.use('/', signOutRoute);

router.use('/*', (req, res, next) => next(new NotFoundError('Указан некорректный путь в URL адресе')));

module.exports = router;
