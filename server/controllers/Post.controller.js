const Post = require('../models/Post.model');
const { errorHandler } = require('../utils/error');

const postController = {

  postCreate: async (req, res, next) => {
    const { title, content } = req.body;
    if (!req.user.isAdmin) {
      return next(errorHandler(403,
        'You are not allowed to create a post'));
    }
    if (!title || !content) {
      return next(errorHandler(400,
        'Please provide all required fields'));
    }
    const slug = title
      .split(' ')
      .join('-')
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, '-');
    const newPost = new Post({
      ...req.body,
      slug,
      userId: req.user.userId,
    })
    try {
      const savePost = await newPost.save();
      res.status(201).json(savePost);
    } catch (e) {
      next(e);
    }
  },
  getPosts: async (req, res, next) => {
    try {
      // Lấy vị trí bắt đầu của danh sách bài viết trả về (mặc định là 0).
      const startIndex = parseInt(req.query.startIndex || 0);
      // Lấy số lượng bài viết tối đa trả về (mặc định là 9).
      const limit = parseInt(req.query.limit || 9);
      // Xác định thứ tự sắp xếp (dựa vào query order). 
      // Nếu order là 'asc' thì sắp xếp tăng dần, còn nếu không thì sắp xếp giảm dần.
      const sortDirection = req.query.order === 'asc' ? 1 : -1;
      //Sử dụng await Post.find(query) để lấy danh sách các bài viết thỏa mãn điều kiện tìm kiếm.
      const posts = await Post.find({
        // Nếu có userId trong query, thì thêm điều kiện userId bằng với req.query.userId vào query.
        ...(req.query.userId &&
          { userId: req.query.userId }),
        // nếu có category, slug, hoặc postId trong query, thì thêm các điều kiện tương ứng vào query.
        ...(req.query.category &&
          { category: req.query.category }),
        ...(req.query.slug && { slug: req.query.slug }),
        ...(req.query.postId && { _id: req.query.postId }),
        /**
         * Nếu có searchTerm trong query, thì thêm điều kiện tìm kiếm theo searchTerm trong cả tiêu đề (title) và nội dung (content) của bài viết, 
         * sử dụng biểu thức chính quy ($regex) 
         * không phân biệt chữ hoa/thứơng ($options: 'i').
        */
        ...(req.query.searchTerm && {
          $or: [
            { title: { $regex: req.query.searchTerm, $options: 'i' } },
            { content: { $regex: req.query.searchTerm, $options: 'i' } },
          ],
        }),
      })
        // Sử dụng để sắp xếp danh sách bài viết theo ngày cập nhật(updateAt) theo thứ tự đã xác định ở bước 1.
        .sort({ updateAt: sortDirection })
        // Sử dụng để bỏ qua các bài viết trước vị trí bắt đầu(startIndex).
        .skip(startIndex)
        // Sử dụng để giới hạn số lượng bài viết trả về tối đa(limit).
        .limit(limit)
      // lưu trữ tổng số lượng bài viết trong database,
      const totalPosts = await Post.countDocuments();
      const now = new Date();
      const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );
      // lưu trữ số lượng bài viết được tạo trong tháng trước
      const lastMonthPosts = await Post.countDocuments({
        // Biểu thức tìm kiếm $gte đảm bảo chỉ tính các bài viết có ngày tạo (createdAt) lớn hơn hoặc bằng oneMonthAgo.
        createdAt: { $gte: oneMonthAgo },
      });
      res.status(200).json({
        posts,
        totalPosts,
        lastMonthPosts,
      });
    } catch (e) {
      next(e);
    }
  },
  deletePost: async (req, res, next) => {
    console.log(req.user);
    console.log(req.params);
    if (!req.user.isAdmin || req.user.userId
      !== req.params.userId) {
      return next(errorHandler(403, 'You are not allowed to delete this post'));
    };
    try {
      await Post.findByIdAndDelete(req.params.postId);
      res.status(200).json('The post has been deleted');
    } catch (e) {
      next(e);
    }
  },
  updatePost: async (req, res, next) => {
    if (!req.user.isAdmin || req.user.userId
      !== req.params.userId) {
      return next(errorHandler(403, 'You are not allowed to update this post'));
    };
    try {
      const updatePost = await Post.findByIdAndUpdate(
        req.params.postId, {
        title: req.body.title,
        content: req.body.content,
        category: req.body.category,
        image: req.body.image,
      }, { new: true, runValidators: true }
      );
      res.status(200).json(updatePost);
    } catch (e) {
      next(e);
    }
  }
}
module.exports = postController