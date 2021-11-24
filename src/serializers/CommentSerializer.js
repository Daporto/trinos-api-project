const BaseSerializer = require('./BaseSerializer');

class CommentSerializer extends BaseSerializer {
  constructor(model, tweetId) {
    const serializedModel = model ? model.toJSON() : null;
    if(model){
      serializedModel.tweetId = tweetId;
    }

    super('success', serializedModel);
  }
}

module.exports = CommentSerializer;
