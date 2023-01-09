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
const post_1 = __importDefault(require("../controllers/post"));
const post_2 = __importDefault(require("../controllers/post"));
const Request_1 = __importDefault(require("../common/Request"));
module.exports = (io, socket) => {
    const getAllPosts = (payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const res = yield post_1.default.getAllPosts(new Request_1.default(payload, socket.data.user, null, null));
            socket.emit("post:get.response", res.body);
        }
        catch (err) {
            socket.emit("post:get.response", { status: "fail" });
        }
    });
    const getPostById = (payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const res = yield post_1.default.getPostById(new Request_1.default(payload, socket.data.user, null, payload.id));
            socket.emit("post:get:id.response", res.body);
        }
        catch (err) {
            socket.emit("post:get:id.response", { status: "fail" });
        }
    });
    const getPostBySender = (payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const res = yield post_1.default.getAllPosts(new Request_1.default(payload, socket.data.user, payload.sender, null));
            socket.emit("post:get:sender.response", res.body);
        }
        catch (err) {
            socket.emit("post:get:sender.response", { status: "fail" });
        }
    });
    const addNewPost = (payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const res = yield post_2.default.addNewPost(new Request_1.default(payload, socket.data.user, null, null));
            socket.emit("post:add.response", res.body);
        }
        catch (err) {
            socket.emit("post:add.response", { status: "fail" });
        }
    });
    const updatePost = (payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const res = yield post_2.default.updatePost(new Request_1.default(payload, socket.data.user, payload.sender, payload.id));
            socket.emit("post:put.response", res.body);
        }
        catch (err) {
            socket.emit("post:put.response", { status: "fail" });
        }
    });
    socket.on("post:get", getAllPosts);
    socket.on("post:get:id", getPostById);
    socket.on("post:add", addNewPost);
    socket.on("post:get:sender", getPostBySender);
    socket.on("post:put", updatePost);
};
//# sourceMappingURL=postHandler.js.map