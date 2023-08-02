const bcrypt = require('bcrypt');
const User = require('../models/user');
const { generateToken } = require('../utils/utils');
const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequest');
const ConflictError = require('../errors/conflictError');

const saltRounds = 10;

function getUsers(req, res, next) {
  return User.find({})
    .then((users) => res.send(users))
    .catch(next);
}

function getUser(req, res, next) {
  const { userId } = req.params;

  return User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`Пользователь по указанному _id: ${userId} не найден`);
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные при запросе пользователя.'));
      }

      return next(err);
    });
}

function getCurrentUser(req, res, next) {
  const userId = req.user._id;

  return User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`Пользователь по указанному _id: ${userId} не найден`);
      }
      res.send(user);
    })
    .catch(next);
}

function createUser(req, res, next) {
  if (Object.keys(req.body).length === 0) {
    throw new BadRequestError('Получены невалидные данные');
  }

  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, saltRounds)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.status(201).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError(`Пользователь с таким Email: ${email} уже существует`));
      }

      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      }

      return next(err);
    });
}

function login(req, res, next) {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = generateToken({ _id: user._id });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      });
      res.send({ token });
    })
    .catch(next);
}

function updateUserInfo(req, res, next) {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`Пользователь с указанным _id: ${req.user._id} не найден.`);
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
      }
      return next(err);
    });
}

function updateAvatar(req, res, next) {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`Пользователь с указанным _id: ${req.user._id} не найден.`);
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
      }
      return next(err);
    });
}

module.exports = {
  getUsers,
  getUser,
  getCurrentUser,
  updateUserInfo,
  updateAvatar,
  login,
  createUser,
};
