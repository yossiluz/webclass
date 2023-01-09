import Post from "../models/post_model";
import NewRequest from "../common/Request";
import NewResponse from "../common/Response";
import NewError from "../common/Error";

const getAllPosts = async (req: NewRequest) => {
  try {
    let posts = {};
    if (req.senderId == null) {
      posts = await Post.find();
    } else {
      posts = await Post.find({ sender: req.senderId });
    }
    return new NewResponse(posts, req.userId, null);
  } catch (err) {
    return new NewResponse(null, req.userId, new NewError(400, err.message));
  }
};

const getPostById = async (req: NewRequest) => {
  try {
    const posts = await Post.findById(req.postId);
    return new NewResponse(posts, req.userId, null);
  } catch (err) {
    return new NewResponse(null, req.userId, new NewError(400, err.message));
  }
};

const addNewPost = async (req: NewRequest) => {
  const post = new Post({
    message: req.body.message,
    sender: req.userId,
  });

  try {
    const newPost = await post.save();
    return new NewResponse(newPost, req.userId, null);
  } catch (err) {
    return new NewResponse(null, req.userId, new NewError(400, err.message));
  }
};

const updatePost = async (req: NewRequest) => {
  try {
    const filter = { _id: req.postId };
    const update = { message: req.body.message };

    const post = await Post.findOneAndUpdate(filter, update, { new: true });
    return new NewResponse(post, req.userId, null);
  } catch (err) {
    return new NewResponse(null, req.userId, new NewError(400, err.message));
  }
};

export = { addNewPost, getPostById, updatePost, getAllPosts };