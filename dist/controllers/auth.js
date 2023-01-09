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
const user_model_1 = __importDefault(require("../models/user_model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function sendError(res, error) {
    res.status(400).send({
        err: error,
    });
}
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    if (email == null || password == null) {
        return sendError(res, "please provide valid email and password");
    }
    try {
        const user = yield user_model_1.default.findOne({ email: email });
        if (user != null) {
            return sendError(res, "user already registered, try a different name");
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const encryptedPwd = yield bcrypt_1.default.hash(password, salt);
        const newUser = new user_model_1.default({
            email: email,
            password: encryptedPwd,
        });
        yield newUser.save();
        return res.status(200).send({
            email: email,
            _id: newUser._id,
        });
    }
    catch (err) {
        return sendError(res, "fail ...");
    }
});
function generateTokens(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const accessToken = jsonwebtoken_1.default.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.JWT_TOKEN_EXPIRATION });
        const refreshToken = jsonwebtoken_1.default.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET);
        return { accessToken: accessToken, refreshToken: refreshToken };
    });
}
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    if (email == null || password == null) {
        return sendError(res, "please provide valid email and password");
    }
    try {
        const user = yield user_model_1.default.findOne({ email: email });
        if (user == null)
            return sendError(res, "incorrect user or password");
        const match = yield bcrypt_1.default.compare(password, user.password);
        if (!match)
            return sendError(res, "incorrect user or password");
        const tokens = yield generateTokens(user._id.toString());
        if (user.refresh_tokens == null)
            user.refresh_tokens = [tokens.refreshToken];
        else
            user.refresh_tokens.push(tokens.refreshToken);
        yield user.save();
        return res.status(200).send(tokens);
    }
    catch (err) {
        console.log("error: " + err);
        return sendError(res, "fail checking user");
    }
});
function getTokenFromRequest(req) {
    const authHeader = req.headers["authorization"];
    if (authHeader == null)
        return null;
    return authHeader.split(" ")[1];
}
const refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = getTokenFromRequest(req);
    if (refreshToken == null)
        return sendError(res, "authentication missing");
    try {
        const user = (jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET));
        const userObj = yield user_model_1.default.findById(user.id);
        if (userObj == null)
            return sendError(res, "fail validating token");
        if (!userObj.refresh_tokens.includes(refreshToken)) {
            userObj.refresh_tokens = [];
            yield userObj.save();
            return sendError(res, "fail validating token");
        }
        const tokens = yield generateTokens(userObj._id.toString());
        userObj.refresh_tokens[userObj.refresh_tokens.indexOf(refreshToken)] =
            tokens.refreshToken;
        console.log("refresh token: " + refreshToken);
        console.log("with token: " + tokens.refreshToken);
        yield userObj.save();
        return res.status(200).send(tokens);
    }
    catch (err) {
        return sendError(res, "fail validating token");
    }
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = getTokenFromRequest(req);
    if (refreshToken == null)
        return sendError(res, "authentication missing");
    try {
        const user = (jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET));
        const userObj = yield user_model_1.default.findById(user.id);
        if (userObj == null)
            return sendError(res, "fail validating token");
        if (!userObj.refresh_tokens.includes(refreshToken)) {
            userObj.refresh_tokens = [];
            yield userObj.save();
            return sendError(res, "fail validating token");
        }
        userObj.refresh_tokens.splice(userObj.refresh_tokens.indexOf(refreshToken), 1);
        yield userObj.save();
        return res.status(200).send();
    }
    catch (err) {
        return sendError(res, "fail validating token");
    }
});
const authenticateMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = getTokenFromRequest(req);
    if (token == null)
        return sendError(res, "authentication missing");
    try {
        const user = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.body.userId = user.id;
        console.log("token user: " + user);
        return next();
    }
    catch (err) {
        return sendError(res, "fail validating token");
    }
});
module.exports = { login, refresh, register, logout, authenticateMiddleware };
//# sourceMappingURL=auth.js.map