const BaseSerializer = require('./BaseSerializer');

class TweetSerializer extends BaseSerializer {
  constructor(model,commentsData,userData) {
    const serializedModel = model ? model.toJSON() : null;

    delete serializedModel?.active;
    
    serializedModel.user = userData;
    serializedModel.comments = commentsData;

    super('success', serializedModel);
  }
}

module.exports = TweetSerializer;
