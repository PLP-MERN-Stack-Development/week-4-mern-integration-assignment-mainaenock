const Post = require('../models/Post');
const slugify = require('slugify');

// @desc    Get all posts
// @route   GET /api/posts
exports.getAllPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const total = await Post.countDocuments();
    const posts = await Post.find()
      .populate('category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    res.json({ posts, total, page, pageCount: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

// @desc    Get a specific post
// @route   GET /api/posts/:id
exports.getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('category');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new post
// @route   POST /api/posts
exports.createPost = async (req, res, next) => {
  try {
    const { title, ...rest } = req.body;
    const slug = slugify(title, { lower: true, strict: true });
    const post = new Post({
      ...rest,
      title,
      slug,
      author: req.user
    });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
exports.updatePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
}; 