const express = require('express');

const router = express.Router();

const {
  createLikeComment,
  deleteCommentById,
} = require('../controllers/comments');

const { authMiddleware } = require('../middlewares/authMiddleware');

router.post('/:id/likes', authMiddleware, createLikeComment);
router.delete('/:id', authMiddleware, deleteCommentById);

module.exports = router;
