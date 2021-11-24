const ApiError = require('../utils/ApiError');

const { Tweet, Comment} = require('../database/models');

const CommentSerializer = require('../serializers/CommentSerializer');

const findTweet = async (where) => {
  Object.assign(where, { active: true });
  
  const tweet = await Tweet.findOne({ where });
  if (!tweet) {
    throw new ApiError('Tweet not found', 400);
  }

  return tweet;
};

const findComment = async (where) => {
  Object.assign(where, { active: true });

  const comment = await Comment.findOne({ where });

  if (!comment) {
    throw new ApiError('Comment not found', 400);
  }

  return comment;
};

const createComment = async (req, res, next) => {
  try {
    const { body, tweet} = req;

    const commentPayload = {
      text: body.text,
      tweetId: tweet.id,
    };

    if (Object.values(commentPayload).some((val) => val === undefined)) {
      throw new ApiError('Payload must contain text', 400);
    }
    objtweet = await Tweet.findTweet({ id: tweet.id })
    const comment = await Comment.create(commentPayload);
    const tweetData = objtweet.toJSON();
    res.json(new CommentSerializer(comment,tweetData.id));
  } catch (err) {
    next(err);
  }
};


const createLikeComment = async (req, res, next) => {
  try {
    const { params , user } = req;

    const commentId = Number(params.id);
    //req.isUserAuthorized(userId);

    const comment = await findComment({ id: commentId });

    Object.assign(comment, { likeCounter: comment.likeCounter+1 });

    await comment.save();

    objtweet = await findTweet({ id: comment.userId });
    const tweetData = objtweet.toJSON();
    res.json(new CommentSerializer(comment,tweetData.id));
  } catch (err) {
    next(err);
  }
};

const deleteCommentById = async (req, res, next) => {
  try {
    const { params } = req;

    const commentId = Number(params.id);
    //req.isUserAuthorized(userId);

    const comment = await findComment({ id: commentId });

    Object.assign(comment, { active: false });
    if(comment){
      Comment.destroy({ where: { id: commentId } })
    }

    res.json(new CommentSerializer(null));
  } catch (err) {
    next(err);
  }
};

module.exports = {
    createComment,
    createLikeComment,
    deleteCommentById,
};
