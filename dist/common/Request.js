"use strict";
class NewRequest {
    constructor(body, userId, senderId, postId) {
        this.body = {};
        this.userId = null;
        this.senderId = null;
        this.postId = null;
        this.body = body;
        this.userId = userId;
        this.senderId = senderId;
        this.postId = postId;
    }
    static fromRestRequest(req) {
        return new NewRequest(req.body, req.body.sender, req.query.sender, req.params.id);
    }
}
module.exports = NewRequest;
//# sourceMappingURL=Request.js.map