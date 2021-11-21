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
const { paginationMiddleware } = require('../middlewares/paginationMiddleware');

router.get('/all', authMiddleware, paginationMiddleware, getAllUsers);

router.post('/', createUser);
router.post('/login', loginUser);

router.get('/:id', getUserById);
router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, deactivateUser);

module.exports = router;
