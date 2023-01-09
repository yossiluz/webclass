"use strict";
/**
 * @swagger
 * tags:
 *   name: Post
 *   description: The Post API
 */
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
/**
 * @swagger
 * components:
 *   schemas:
 *       Post:
 *           type: object
 *           required:
 *               - message
 *               - sender
 *           properties:
 *               message:
 *                   type: string
 *                   description: The post text
 *               sender:
 *                   type: string
 *                   description: The sender name
 *           example:
 *               message: 'This is new post'
 *               sender: '12345'
 */
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const post_1 = __importDefault(require("../controllers/post"));
const auth_1 = __importDefault(require("../controllers/auth"));
const Request_1 = __importDefault(require("../common/Request"));
/**
 * @swagger
 * /post:
 *   get:
 *       summary: Get post by id
 *       tags: [Post]
 *       security:
 *           - bearerAuth: []
 *       parameters:
 *         - in: query
 *           name: sender
 *           schema:
 *               type: string
 *               description: Filter posts by sender
 *       responses:
 *           200:
 *               description: Requested post
 *               content:
 *                   application/json:
 *                       schema:
 *                           $ref: '#/components/schemas/Post'
 */
//All posts page route
router.get("/", auth_1.default.authenticateMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield post_1.default.getAllPosts(Request_1.default.fromRestRequest(req));
        response.sendRestResponse(res);
    }
    catch (err) {
        res.status(400).send({
            status: "Fail",
            message: err.message,
        });
    }
}));
/**
 * @swagger
 * /post/{id}:
 *   get:
 *       summary: Get post by id
 *       tags: [Post]
 *       security:
 *           - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *               type: string
 *               description: Filter posts by sender
 *       responses:
 *           200:
 *               description: The new user
 *               content:
 *                   application/json:
 *                       schema:
 *                           type: array
 *                           items:
 *                               $ref: '#/components/schemas/Post'
 */
//Post by id
router.get("/:id", auth_1.default.authenticateMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield post_1.default.getPostById(Request_1.default.fromRestRequest(req));
        response.sendRestResponse(res);
    }
    catch (err) {
        res.status(400).send({
            status: "Fail",
            message: err.message,
        });
    }
}));
//New post page route
router.post("/", auth_1.default.authenticateMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield post_1.default.addNewPost(Request_1.default.fromRestRequest(req));
        response.sendRestResponse(res);
    }
    catch (err) {
        res.status(400).send({
            status: "Fail",
            message: err.message,
        });
    }
}));
//Update post route
router.put("/:id", auth_1.default.authenticateMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield post_1.default.updatePost(Request_1.default.fromRestRequest(req));
        response.sendRestResponse(res);
    }
    catch (err) {
        res.status(400).send({
            status: "Fail",
            message: err.message,
        });
    }
}));
module.exports = router;
//# sourceMappingURL=post_route.js.map