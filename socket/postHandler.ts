import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import postController from "../controllers/post";
import post from "../controllers/post";
import NewRequest from "../common/Request";

export = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>
) => {
  const getAllPosts = async (payload: any) => {
    try {
      const res = await postController.getAllPosts(
        new NewRequest(payload, socket.data.user, null, null)
      );
      socket.emit("post:get.response", res.body);
    } catch (err) {
      socket.emit("post:get.response", { status: "fail" });
    }
  };

  const getPostById = async (payload: any) => {
    try {
      const res = await postController.getPostById(
        new NewRequest(payload, socket.data.user, null, payload.id)
      );
      socket.emit("post:get:id.response", res.body);
    } catch (err) {
      socket.emit("post:get:id.response", { status: "fail" });
    }
  };

  const getPostBySender = async (payload: any) => {
    try {
      const res = await postController.getAllPosts(
        new NewRequest(payload, socket.data.user, payload.sender, null)
      );
      socket.emit("post:get:sender.response", res.body);
    } catch (err) {
      socket.emit("post:get:sender.response", { status: "fail" });
    }
  };

  const addNewPost = async (payload: any) => {
    try {
      const res = await post.addNewPost(
        new NewRequest(payload, socket.data.user, null, null)
      );
      socket.emit("post:add.response", res.body);
    } catch (err) {
      socket.emit("post:add.response", { status: "fail" });
    }
  };

  const updatePost = async (payload: any) => {
    try {
      const res = await post.updatePost(
        new NewRequest(payload, socket.data.user, payload.sender, payload.id)
      );
      socket.emit("post:put.response", res.body);
    } catch (err) {
      socket.emit("post:put.response", { status: "fail" });
    }
  };

  socket.on("post:get", getAllPosts);
  socket.on("post:get:id", getPostById);
  socket.on("post:add", addNewPost);
  socket.on("post:get:sender", getPostBySender);
  socket.on("post:put", updatePost);
};