"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const post_model_1 = __importDefault(require("../models/post_model"));
const Response_1 = __importDefault(require("../common/Response"));
const Error_1 = __importDefault(require("../common/Error"));
const getAllPosts = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let posts = {};
        if (req.senderId == null) {
            posts = yield post_model_1.default.find();
        }
        else {
            posts = yield post_model_1.default.find({ sender: req.senderId });
        }
        return new Response_1.default(posts, req.userId, null);
    }
    catch (err) {
        return new Response_1.default(null, req.userId, new Error_1.default(400, err.message));
    }
});
const getPostById = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield post_model_1.default.findById(req.postId);
        return new Response_1.default(posts, req.userId, null);
    }
    catch (err) {
        return new Response_1.default(null, req.userId, new Error_1.default(400, err.message));
    }
});
const addNewPost = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const post = new post_model_1.default({
        message: req.body.message,
        sender: req.userId,
    });
    try {
        const newPost = yield post.save();
        return new Response_1.default(newPost, req.userId, null);
    }
    catch (err) {
        return new Response_1.default(null, req.userId, new Error_1.default(400, err.message));
    }
});
const updatePost = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filter = { _id: req.postId };
        const update = { message: req.body.message };
        const post = yield post_model_1.default.findOneAndUpdate(filter, update, { new: true });
        return new Response_1.default(post, req.userId, null);
    }
    catch (err) {
        return new Response_1.default(null, req.userId, new Error_1.default(400, err.message));
    }
});
module.exports = { addNewPost, getPostById, updatePost, getAllPosts };
//# sourceMappingURL=post.js.map