'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Comment.init({
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    likeCounter: {
      type: DataTypes.INTEGER,
      defaultValue:0,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    tweetId:{
      type: DataTypes.INTEGER,
      defaultValue:0,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};