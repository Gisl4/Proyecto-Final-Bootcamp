const express = require("express");
const {
  deleteChat,
  getAllChats,
  getChatById,
  getChatByUser,
  createEmptyChat,
} = require("../controllers/Chat.controllers");
const { isAuth } = require("../../middleware/auth.middleware");
const ChatRoutes = express.Router();

ChatRoutes.post("/:idRecipient", [isAuth], createEmptyChat);
ChatRoutes.delete("/:id", [isAuth], deleteChat);
ChatRoutes.get("/get/id/:id", [isAuth], getChatById);
ChatRoutes.get("/get/all", [isAuth], getAllChats);
ChatRoutes.get("/get/:idUser", [isAuth], getChatByUser);
ChatRoutes.get("/get/", [isAuth], getChatByUser);

module.exports = ChatRoutes;
