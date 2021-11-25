const BaseSerializer = require('./BaseSerializer');

class TweetSerializer extends BaseSerializer {
  constructor(model, commentsData, userData) {
    const serializedModel = model ? model.toJSON() : null;

    delete serializedModel?.active;
    delete serializedModel?.userId;

    if (model) {
      serializedModel.user = userData;

      const commentsD = commentsData.filter((item) => item.tweetId === serializedModel.id);

      if (commentsD) {
        serializedModel.comments = commentsD;
      } else {
        serializedModel.comments = [];
      }
    }

    super('success', serializedModel);
  }
}

module.exports = TweetSerializer;
