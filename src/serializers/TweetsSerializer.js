const BaseSerializer = require('./BaseSerializer');

class TweetsSerializer extends BaseSerializer {
  constructor(models, paginationInfo) {
    const serializedModels = models.map((model) => {
      const serializedModel = model.toJSON();

      delete serializedModel?.active;

      return serializedModel;
    });

    super('success', serializedModels, paginationInfo);
  }
}

module.exports = TweetsSerializer;
