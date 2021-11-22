const ApiError = require('../utils/ApiError');

const { User, Tweet} = require('../database/models');

const TweetSerializer = require('../serializers/TweetSerializer');
const TweetsSerializer = require('../serializers/TweetsSerializer');

const findTweet = async (where) => {
  Object.assign(where, { active: true });
  
  const tweet = await Tweet.findOne({ where });
  if (!tweet) {
    throw new ApiError('Tweet not found', 400);
  }

  return tweet;
};

const getAllTweets = async (req, res, next) => {
  try {
    //req.isRole(ROLES.admin);
    
    //where= { active: true };

    const tweets = await Tweet.findAll({ ...req.pagination });
    
    const commentsData = [];
    const userData = {};

    res.json(new TweetsSerializer(tweets, commentsData, userData, await req.getPaginationInfo(Tweet)));
  } catch (err) {
    next(err);
  }
};

const createTweet = async (req, res, next) => {
  try {
    const { body } = req;

    const tweetPayload = {
      text: body.text,
    };

    if (Object.values(tweetPayload).some((val) => val === undefined)) {
      throw new ApiError('Payload must contain text', 400);
    }

    const tweet = await Tweet.create(tweetPayload);
    const commentsData = [];
    const userData = {};

    res.json(new TweetSerializer(tweet,commentsData,userData));
  } catch (err) {
    next(err);
  }
};

const getTweetById = async (req, res, next) => {
  try {
    const { params } = req;

    const tweet = await findTweet({ id: Number(params.id) });

    const commentsData = [];
    const userData = {};

    res.json(new TweetSerializer(tweet,commentsData,userData));
  } catch (err) {
    next(err);
  }
};

const getTweetFeedByUsername = async (req, res, next) => {
  
};

const createLikeTweet = async (req, res, next) => {
  
};

const createTweetComments = async (req, res, next) => {
  
};

const deleteTweetById = async (req, res, next) => {
  try {
    const { params } = req;

    const tweetId = Number(params.id);
    //req.isUserAuthorized(userId);

    const tweet = await findTweet({ id: tweetId });

    Object.assign(tweet, { active: false });
    if(tweet){
      Tweet.destroy({ where: { id: tweetId } })
    }

    res.json(new TweetSerializer(null));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllTweets,
  createTweet,
  getTweetById,
  getTweetFeedByUsername,
  createLikeTweet,
  createTweetComments,
  deleteTweetById,
};
