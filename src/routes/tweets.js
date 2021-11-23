const express = require('express');

const router = express.Router();


const {
  getAllTweets,
  createTweet,
  getTweetById,
  getTweetFeedByUsername,
  createLikeTweet,
  createTweetComments,
  deleteTweetById,
} = require('../controllers/tweets');

const { authMiddleware } = require('../middlewares/authMiddleware');
const { paginationMiddleware } = require('../middlewares/paginationMiddleware');

router.get("/",authMiddleware, paginationMiddleware, getAllTweets);

router.get("/:id", getTweetById);

router.get("/feed/:username", paginationMiddleware, getTweetFeedByUsername);

router.post("/", authMiddleware, createTweet);

router.post("/:id/likes", authMiddleware, createLikeTweet);

router.post("/:id/comments", authMiddleware, createTweetComments);

router.delete("/:id", authMiddleware, deleteTweetById);

module.exports = router;
