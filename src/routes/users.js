const express = require('express');

const router = express.Router();

const {
  createUser,
  getUserById,
  updateUser,
  deactivateUser,
  loginUser,
  getAllUsers,
} = require('../controllers/users');

const { authMiddleware } = require('../middlewares/authMiddleware');

router.get('/all', authMiddleware, getAllUsers);

router.post('/', createUser);
router.post('/login', loginUser);

router.get('/:id', getUserById);
router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, deactivateUser);

module.exports = router;
