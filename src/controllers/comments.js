const ApiError = require('../utils/ApiError');

const { Tweet, Comment } = require('../database/models');

const CommentSerializer = require('../serializers/CommentSerializer');

const CommentsSerializer = require('../serializers/CommentsSerializer');

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
    const { body } = req;
    const { params } = req;
    const commentPayload = {
      text: body.text,
      tweetId: Number(params.id),
    };

    if (Object.values(commentPayload).some((val) => val === undefined)) {
      throw new ApiError('Payload must contain text', 400);
    }
    const tweet = await Tweet.findOne({ where: { id: commentPayload.tweetId } });
    if (!tweet) {
      throw new ApiError('Tweet not found', 400);
    }
    const comment = await Comment.create(commentPayload);
    res.json(new CommentSerializer(comment, tweet.id));
  } catch (err) {
    next(err);
  }
};

const createLikeComment = async (req, res, next) => {
  try {
    const { params } = req;

    const commentId = Number(params.id);
    req.isUserAuthorized(req.user.id);

    const comment = await findComment({ id: commentId });

    Object.assign(comment, { likeCounter: comment.likeCounter + 1 });

    await comment.save();

    const objtweet = await findTweet({ id: comment.tweetId });
    const tweetData = objtweet.toJSON();
    res.json(new CommentSerializer(comment, tweetData.id));
  } catch (err) {
    next(err);
  }
};

const deleteCommentById = async (req, res, next) => {
  try {
    const { params } = req;

    const commentId = Number(params.id);
    req.isUserAuthorized(req.user.id);

    const comment = await findComment({ id: commentId });

    Object.assign(comment, { active: false });
    if (comment) {
      Comment.destroy({ where: { id: commentId } });
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
