const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { truncate } = require('fs');
const ApiError = require('../utils/ApiError');
const { verifyAccessToken } = require('../services/jwt');

const { User } = require('../database/models');
const { generateAccessToken } = require('../services/jwt');

const UserSerializer = require('../serializers/UserSerializer');
const AuthSerializer = require('../serializers/AuthSerializer');
const UsersSerializer = require('../serializers/UsersSerializer');

const { ROLES } = require('../config/constants');

const findUser = async (where) => {
  Object.assign(where, { active: true });

  const user = await User.findOne({ where });
  if (!user) {
    throw new ApiError('User not found', 400);
  }

  return user;
};

const getAllUsers = async (req, res, next) => {
  try {
    req.isRole([ROLES.admin]);
    const users = await User.findAll({ ...req.pagination });
    res.json(new UsersSerializer(users, await req.getPaginationInfo(User)));
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { body } = req;

    if (body.password !== body.passwordConfirmation) {
      throw new ApiError('Passwords do not match', 400);
    }

    const userPayload = {
      username: body.username,
      email: body.email,
      name: body.name,
      password: body.password,
    };

    if (Object.values(userPayload).some((val) => val === undefined)) {
      throw new ApiError('Payload must contain name, username, email and password', 400);
    }

    const user = await User.create(userPayload);

    res.json(new UserSerializer(user));
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { params } = req;

    const user = await findUser({ id: Number(params.id) });

    res.json(new UserSerializer(user));
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { params, body } = req;

    const userId = Number(params.id);
    req.isUserAuthorized(userId);

    const user = await findUser({ id: userId });

    const userPayload = {
      username: body.username,
      email: body.email,
      name: body.name,
    };

    if (Object.values(userPayload).some((val) => val === undefined)) {
      throw new ApiError('Payload can only contain username, email or name', 400);
    }

    Object.assign(user, userPayload);

    await user.save();

    res.json(new UserSerializer(user));
  } catch (err) {
    next(err);
  }
};

const deactivateUser = async (req, res, next) => {
  try {
    const { params } = req;

    const userId = Number(params.id);
    req.isUserAuthorized(userId);

    const user = await findUser({ id: userId });

    Object.assign(user, { active: false });

    await user.save();

    res.json(new UserSerializer(null));
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { body } = req;

    const user = await findUser({ username: body.username });

    if (!(await user.comparePassword(body.password))) {
      throw new ApiError('User not found', 400);
    }

    const accessToken = generateAccessToken(user.id, user.role);

    res.json(new AuthSerializer(accessToken));
  } catch (err) {
    next(err);
  }
};
const updatePassword = async (req, res, next) => {
  try {
    req.isRole([ROLES.admin, ROLES.regular]);
    const { body } = req;
    if (!body.password || !body.passwordConfirmation) {
      throw new ApiError('body request have to contain password and passwordConfirmation', 400);
    }
    if (body.password !== body.passwordConfirmation) {
      throw new ApiError('Passwords do not match', 400);
    }
    const userPayload = {
      password: body.password,
    };
    const user = await findUser({ id: req.user.id });
    Object.assign(user, userPayload);
    await user.save();
    res.json(new UserSerializer(user));
  } catch (err) {
    next(err);
  }
};

const sendemail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'testing.development.max@gmail.com',
      pass: 'Test1234!',
    },
  });

  const info = await transporter.sendMail({
    from: '"Equipo trinos-api" daporto@uninorte.edu.co',
    to: email,
    subject: 'Cambio de contraseña',
    text: 'Hola recibe un cordial saludo, este es tu token para cambio de contraseña: ', // plain text body
    html: `<b>Hola recibe un cordial saludo, este es tu token para cambio de contraseña: ${token}</b>`, // html body
  });
};

const sendPasswordReset = async (req, res, next) => {
  try {
    const { body } = req;

    const user = await findUser({ username: body.username });
    const token = generateAccessToken(user.id, user.role);
    // let token = crypto.randomBytes(48);
    // token = token.toString('hex');
    const userPayload = {
      token,
    };
    Object.assign(user, userPayload);
    await user.save();
    await sendemail(user.email, token);
    res.json(new UserSerializer(user));
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  const { body } = req;
  if (!body.password || !body.passwordConfirmation || !body.token) {
    throw new ApiError('body request have to contain password, passwordConfirmation and token', 400);
  }
  if (body.password !== body.passwordConfirmation) {
    throw new ApiError('Passwords do not match', 400);
  }
  const user = await findUser({ token: body.token });
  const userPayload = {
    password: body.password,
  };
  Object.assign(user, userPayload);
  await user.save();
  res.json(new UserSerializer(user));
};

module.exports = {
  createUser,
  getUserById,
  updateUser,
  deactivateUser,
  loginUser,
  getAllUsers,
  updatePassword,
  sendPasswordReset,
  resetPassword,
};
