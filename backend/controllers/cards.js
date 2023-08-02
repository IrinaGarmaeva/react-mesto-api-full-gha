const Card = require('../models/card');
const BadRequestError = require('../errors/badRequest');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');

async function getCards(req, res, next) {
  return Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
}

function createCard(req, res, next) {
  const { name, link } = req.body;
  const owner = req.user._id;

  return Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании карточки.'));
      }
      return next(err);
    });
}

function deleteCard(req, res, next) {
  const { cardId } = req.params;

  return Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Карточка с указанным _id: ${cardId} не найдена.`);
      }

      if (String(card.owner) !== req.user._id) {
        throw new ForbiddenError('Недостаточно прав для удаления карточки');
      }

      return Card.findByIdAndRemove(cardId)
        .then((data) => res.send(data))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные при удалении карточки.'));
      }
      return next(err);
    });
}

function addLike(req, res, next) {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: [req.user._id] } }, { new: true })
    .then((card) => {
      if (card === null) {
        throw new NotFoundError(`Передан несуществующий _id: ${req.params.cardId} карточки.`);
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные для постановки лайка.'));
      }
      return next(err);
    });
}

function removeLike(req, res, next) {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card === null) {
        throw new NotFoundError(`Передан несуществующий _id: ${req.params.cardId} карточки.`);
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные для снятия лайка.'));
      }
      return next(err);
    });
}

module.exports = {
  getCards, createCard, deleteCard, addLike, removeLike,
};
