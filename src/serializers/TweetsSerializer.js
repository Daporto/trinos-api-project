const BaseSerializer = require('./BaseSerializer');

class TweetsSerializer extends BaseSerializer {
  constructor(models, commentsData, userData, paginationInfo) {
    const serializedModels = models.map((model) => {
      const serializedModel = model.toJSON();

      serializedModel.user = userData.find(item => item.id === serializedModel.userId);
      delete serializedModel.user.password;
      delete serializedModel.user.active;
      delete serializedModel.user.role;
      
      serializedModel.comments = commentsData;

      delete serializedModel?.active;
      delete serializedModel?.userId;

      return serializedModel;
    });

    super('success', serializedModels, paginationInfo);
  }
}

module.exports = TweetsSerializer;
