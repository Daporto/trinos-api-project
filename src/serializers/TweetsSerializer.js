const BaseSerializer = require('./BaseSerializer');

class TweetsSerializer extends BaseSerializer {
  constructor(models, commentsData, userData, paginationInfo) {
    const serializedModels = models.map((model) => {
      const serializedModel = model.toJSON();

      serializedModel.user = userData.find((item) => item.id === serializedModel.userId);
      delete serializedModel.user.password;
      delete serializedModel.user.active;
      delete serializedModel.user.role;

      const commentsD = commentsData.filter((item) => item.tweetId === serializedModel.id);

      if(commentsD){
        serializedModel.comments = commentsD;
      }else{
        serializedModel.comments = [];
      }
      

      delete serializedModel?.active;
      delete serializedModel?.userId;

      return serializedModel;
    });

    super('success', serializedModels, paginationInfo);
  }
}

module.exports = TweetsSerializer;
