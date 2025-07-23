const Comment = require('../models/Comment');
const User = require('../models/User');

// @desc    Get comments for a post
// @route   GET /api/posts/:id/comments
exports.getCommentsForPost = async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.id })
      .populate('user', 'username')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    next(err);
  }
};

// @desc    Add a comment to a post
// @route   POST /api/posts/:id/comments
exports.addComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const comment = new Comment({
      post: req.params.id,
      user: req.user,
      content
    });
    await comment.save();
    await comment.populate('user', 'username');
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
}; 