const express = require('express');

const router = express.Router();

const {
  getAllTweets,
  createTweet,
  getTweetById,
  getTweetFeedByUsername,
  createLikeTweet,
  deleteTweetById,
} = require('../controllers/tweets');
const {
  createComment,
} = require('../controllers/comments');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { paginationMiddleware } = require('../middlewares/paginationMiddleware');

router.get('/', authMiddleware, paginationMiddleware, getAllTweets);

router.get('/:id', getTweetById);

router.get('/feed/:username', paginationMiddleware, getTweetFeedByUsername);

router.post('/', authMiddleware, createTweet);

router.post('/:id/likes', authMiddleware, createLikeTweet);

router.post('/:id/comments', authMiddleware, createComment);

router.delete('/:id', authMiddleware, deleteTweetById);

module.exports = router;
