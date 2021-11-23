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

const findUser = async (where) => {
  Object.assign(where, { active: true });

  const user = await User.findOne({ where });

  if (!user) {
    throw new ApiError('User not found', 400);
  }

  return user;
};

const getAllTweets = async (req, res, next) => {
  try {
    //req.isRole(ROLES.admin);
    
    //where= { active: true };

    const { user } = req;
    //console.log(req);
    //console.log(user);

    const tweets = await Tweet.findAll({ ...req.pagination });

    const users = await User.findAll();
    
    const commentsData = [];
    const userData = users.map((model) => {
      const serializedModel = model.toJSON();

      return serializedModel;
    });

    //console.log(userData.find(item => item.id === 1))

    res.json(new TweetsSerializer(tweets, commentsData, userData, await req.getPaginationInfo(Tweet)));
  } catch (err) {
    next(err);
  }
};

const createTweet = async (req, res, next) => {
  try {
    const { body, user } = req;

    const tweetPayload = {
      text: body.text,
      userId: user.id,
    };

    if (Object.values(tweetPayload).some((val) => val === undefined)) {
      throw new ApiError('Payload must contain text', 400);
    }

    objUser = await findUser({ id: user.id });

    const tweet = await Tweet.create(tweetPayload);
    const commentsData = [];
    const userData = objUser.toJSON();
    delete userData?.password;
    delete userData?.active;
    delete userData?.role;

    res.json(new TweetSerializer(tweet,commentsData,userData));
  } catch (err) {
    next(err);
  }
};

const getTweetById = async (req, res, next) => {
  try {
    const { params } = req;

    const tweet = await findTweet({ id: Number(params.id) });

    objUser = await findUser({ id: tweet.userId });

    const commentsData = [];
    const userData = objUser.toJSON();
    delete userData?.password;
    delete userData?.active;
    delete userData?.role;

    res.json(new TweetSerializer(tweet,commentsData,userData));
  } catch (err) {
    next(err);
  }
};

const getTweetFeedByUsername = async (req, res, next) => {
  try {
    const { params } = req;

    const objUser = await findUser({ username: params.username });
    console.log(objUser);

    const where = { userId: objUser.id }

    const tweets = await Tweet.findAll({ where, ...req.pagination });


    const users = await User.findAll();
    
    const commentsData = [];
    const userData = users.map((model) => {
      const serializedModel = model.toJSON();

      return serializedModel;
    });

    res.json(new TweetsSerializer(tweets, commentsData, userData, await req.getPaginationInfo(Tweet)));
  } catch (err) {
    next(err);
  }
};

const createLikeTweet = async (req, res, next) => {
  try {
    const { params , user } = req;

    const tweetId = Number(params.id);
    //req.isUserAuthorized(userId);

    const tweet = await findTweet({ id: tweetId });

    Object.assign(tweet, { likeCounter: tweet.likeCounter+1 });

    await tweet.save();

    objUser = await findUser({ id: tweet.userId });
    
    const commentsData = [];
    const userData = objUser.toJSON();
    delete userData?.password;
    delete userData?.active;
    delete userData?.role;

    res.json(new TweetSerializer(tweet,commentsData,userData));
  } catch (err) {
    next(err);
  }
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
