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

const { paginationMiddleware } = require('../middlewares/paginationMiddleware');

router.get("/",paginationMiddleware,getAllTweets);

router.get("/:id",getTweetById);

router.get("/feed/:username",getTweetFeedByUsername);

router.post("/",createTweet);

router.post("/:id/likes",createLikeTweet);

router.post("/:id/comments",createTweetComments);

router.delete("/:id",deleteTweetById);

module.exports = router;
