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
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../app"));
const mongoose_1 = __importDefault(require("mongoose"));
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const supertest_1 = __importDefault(require("supertest"));
const post_model_1 = __importDefault(require("../models/post_model"));
const user_model_1 = __importDefault(require("../models/user_model"));
const userEmail = "user1@gmail.com";
const userEmail2 = "user2@gmail.com";
const userPassword = "12345";
const firstMessage = "This is my first socket message";
const secoundMessage = "This is my secound socket message";
let postId = null;
let client1;
let client2;
function clientSocketConnect(clientSocket) {
    return new Promise((resolve) => {
        clientSocket.on("connect", () => {
            resolve("1");
        });
    });
}
const connectUser = (userEmail, userPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const response1 = yield (0, supertest_1.default)(app_1.default).post("/auth/register").send({
        email: userEmail,
        password: userPassword,
    });
    const userId = response1.body._id;
    const response = yield (0, supertest_1.default)(app_1.default).post("/auth/login").send({
        email: userEmail,
        password: userPassword,
    });
    const token = response.body.accessToken;
    const socket = (0, socket_io_client_1.default)("http://localhost:" + process.env.PORT, {
        auth: {
            token: "barrer " + token,
        },
    });
    yield clientSocketConnect(socket);
    const client = { socket: socket, access_token: token, id: userId };
    return client;
});
describe("my awesome project", () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield post_model_1.default.deleteMany();
        yield user_model_1.default.deleteMany();
        client1 = yield connectUser(userEmail, userPassword);
        client2 = yield connectUser(userEmail2, userPassword);
    }));
    afterAll(() => {
        app_1.default.close();
        client1.socket.close();
        client2.socket.close();
        mongoose_1.default.connection.close();
    });
    test("should work", (done) => {
        client1.socket.once("echo:echo_res", (arg) => {
            expect(arg.msg).toBe("hello");
            done();
        });
        client1.socket.emit("echo:echo", { msg: "hello" });
    });
    test("postAdd", (done) => {
        client1.socket.once("post:add.response", (arg) => {
            expect(arg.message).toEqual(firstMessage);
            expect(arg.sender).toEqual(client1.id);
            postId = arg._id;
            done();
        });
        client1.socket.emit("post:add", { message: firstMessage });
    });
    test("Post get all test", (done) => {
        client1.socket.once("post:get.response", (arg) => {
            expect(arg[0].message).toEqual(firstMessage);
            done();
        });
        client1.socket.emit("post:get");
    });
    test("Post get by sender", (done) => {
        client2.socket.once("post:get:sender.response", (arg) => {
            expect(arg[0].message).toEqual(firstMessage);
            expect(arg[0].sender).toEqual(client1.id);
            done();
        });
        client2.socket.emit("post:get:sender", { sender: client1.id });
    });
    test("Post get by ID", (done) => {
        client2.socket.once("post:get:id.response", (arg) => {
            expect(arg.message).toEqual(firstMessage);
            expect(arg.sender).toEqual(client1.id);
            done();
        });
        client2.socket.emit("post:get:id", { id: postId });
    });
    test("Update post", (done) => {
        client1.socket.once("post:put.response", (arg) => {
            expect(arg.message).toEqual(secoundMessage);
            expect(arg.sender).toEqual(client1.id);
            done();
        });
        client1.socket.emit("post:put", { id: postId, message: secoundMessage });
    });
    test("Test chat messages", (done) => {
        const msg = "Hi.... Test123";
        client2.socket.once("chat:message", (args) => {
            expect(args.to).toBe(client2.id);
            expect(args.message).toBe(msg);
            expect(args.from).toBe(client1.id);
            done();
        });
        client1.socket.emit("chat:send_message", { to: client2.id, message: msg });
    });
});
//# sourceMappingURL=socket.test.js.map