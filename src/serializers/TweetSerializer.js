const BaseSerializer = require('./BaseSerializer');

class TweetSerializer extends BaseSerializer {
  constructor(model, commentsData, userData) {
    const serializedModel = model ? model.toJSON() : null;

    delete serializedModel?.active;
    delete serializedModel?.userId;

    if (model) {
      serializedModel.user = userData;
      serializedModel.comments = commentsData;
    }

    super('success', serializedModel);
  }
}

module.exports = TweetSerializer;
