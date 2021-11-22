/* eslint-disable no-param-reassign */
const {
  Model,
} = require('sequelize');

/* const bcrypt = require('bcrypt');

const { SALT_ROUNDS } = require('../../config');

const { ROLES } = require('../../config/constants'); */

module.exports = (sequelize, DataTypes) => {
  class Tweet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    /* comparePassword(plainTextPassword) {
      return bcrypt.compare(plainTextPassword, this.password);
    } */
  }
  Tweet.init({
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    likeCounter: {
      type: DataTypes.INTEGER,
      defaultValue:0,
    },/* 
    user: {
      type: DataTypes.JSON,
    },
    comments: {
      type: DataTypes.ARRAY,
    }, */
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    userId:{
      type: DataTypes.INTEGER,
      defaultValue:0,
    },
  }, {
    sequelize,
    modelName: 'Tweet',
  });

  /* const encryptPassword = async (user) => {
    if (user.changed('password')) {
      user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
    }
  };

  User.beforeCreate(encryptPassword);
  User.beforeUpdate(encryptPassword); */

  return Tweet;
};
