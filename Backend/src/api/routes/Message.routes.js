const express = require("express");
const {
  createMessage,
  deleteMessage,
  updateMessage,
  getAllMessages,
  getMessageById,
  getMessageByUserOwner,
  toggleLikeMessage,
} = require("../controllers/Message.controllers");
const { isAuth } = require("../../middleware/auth.middleware");
const MessageRoutes = express.Router();

MessageRoutes.post("/:idRecipient", [isAuth], createMessage);
MessageRoutes.delete("/:id", [isAuth], deleteMessage);
MessageRoutes.patch("/:id", [isAuth], updateMessage);
MessageRoutes.get("/get/id/:id", [isAuth], getMessageById);
MessageRoutes.get("/get/all", [isAuth], getAllMessages);
MessageRoutes.get("/get/:idUserOwner", [isAuth], getMessageByUserOwner);
MessageRoutes.patch("/like/:idMessage", [isAuth], toggleLikeMessage);

module.exports = MessageRoutes;
