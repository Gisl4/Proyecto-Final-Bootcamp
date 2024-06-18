const Chat = require("../models/Chat.model");
const Message = require("../models/Message.model");
const Event = require("../models/Events.model");
const Experience = require("../models/Experience.model");
const User = require("../models/User.model");

//! ---------------------------------------------------------------------
//? -------------------------------CREATE EMPTY CHAT -------------------------------
//! ---------------------------------------------------------------------

const createEmptyChat = async (req, res, next) => {
  try {
    const { idRecipient } = req.params; // -----> id del objetivo del comentario
    /**
     * idRecipient puede ser el id de : experience, user
     */

    const findUser = await User.findById(idRecipient);

    /**
     * cuando no lo encuentre devuelve un null y el que encuentre va a devolver el objeto encontrado
     *
     */

    if (findUser) {
      //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      // ---------------------------- CREAR CHAT PORQUE NO EXISTE NINGUNO ---------------------------------------
      //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      /// crear un chat con el comentario que hemos creado

      const newChat = new Chat({
        userOne: req.user._id,
        userTwo: findUser._id,
      });

      try {
        await newChat.save();

        try {
          await User.findByIdAndUpdate(req.user._id, {
            $push: {
              chats: newChat._id,
            },
          });

          try {
            await User.findByIdAndUpdate(idRecipient, {
              $push: {
                chats: newChat._id,
              },
            });

            return res.status(200).json({
              chat: await Chat.findById(newChat._id).populate(
                "messages  userOne  userTwo"
              ),
            });
          } catch (error) {
            return res.status(404).json({
              error: "no hemos actualizado el segundo user del chat",
            });
          }
        } catch (error) {
          return res.status(404).json({
            error: "no hemos actualizado el user dueño del chat",
          });
        }
      } catch (error) {
        return res.status(404).json({
          error: "no se ha creado el chat",
        });
      }
    }
  } catch (error) {
    return res.status(404).json(error.message);
  }
};

//! ---------------------------------------------------------------------
//? -------------------------------DELETE MESSAGE -------------------------------
//! ---------------------------------------------------------------------
const deleteChat = async (req, res, next) => {
  try {
    const { id } = req.params;
    const chat = await Chat.findById(id);

    try {
      const messages = await Message.findById({ $in: chat.messages });

      console.log(messages);
      if (messages) {
        console.log("ENTRA DELETE");

        try {
          await User.updateMany(
            { messagesFav: { $in: chat.messages } },
            { $pull: { messagesFav: { $in: chat.messages } } }
          );
          await User.updateMany({
            $pull: { postedMessages: { $in: chat.messages } },
          });
          await User.updateMany({
            $pull: { commentsPublicByOther: { $in: chat.messages } },
          });
          await User.updateMany({ chats: id }, { $pull: { chats: id } });

          try {
            const messagesDelete = await Message.deleteMany({
              _id: { $in: chat.messages },
            });
            try {
              const chatDelete = await Chat.findByIdAndDelete(id);
              // lo buscamos para ver si sigue existiendo o no
              const finByIdChat = await Chat.findById(id);
              return res.status(finByIdChat ? 404 : 200).json({
                deleteTest: finByIdChat ? false : true,
              });
            } catch (error) {
              return res.status(404).json(error.message);
            }
          } catch (error) {
            return res.status(404).json({
              error: "error catch delete messages",
              message: error.message,
            });
          }
        } catch (error) {
          return res.status(404).json({
            error: "error catch update User",
            message: error.message,
          });
        }
      } else {
        try {
          await User.updateMany({ chats: id }, { $pull: { chats: id } });
          try {
            const chatDelete = await Chat.findByIdAndDelete(id);
          } catch (error) {
            return res.status(404).json({
              error: "error delete chat",
              message: error.message,
            });
          }
        } catch (error) {
          return res.status(404).json({
            error: "error delete chat from user/s",
            message: error.message,
          });
        }
      }
    } catch (error) {
      return res.status(404).json(error.message);
    }
  } catch (error) {
    return res.status(404).json({
      error: "error catch find Chat",
      message: error.message,
    });
  }
};

//! ---------------------------------------------------------------------
//? -------------------------------get chat by id--------------------------
//! ---------------------------------------------------------------------
const getChatById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const chatById = await Chat.findById(id)
      .populate({
        path: "messages",
        populate: [{ path: "owner" }, { path: "likes" }],
      })
      .populate("userTwo")
      .populate("userOne");
    if (chatById) {
      return res.status(200).json(chatById);
    } else {
      return res.status(404).json("no se ha encontrado el chat");
    }
  } catch (error) {
    return res.status(404).json(error.message);
  }
};

//! ---------------------------------------------------------------------
//? -------------------------------get chat by user owner--------------------------
//! ---------------------------------------------------------------------

const getChatByUser = async (req, res, next) => {
  try {
    const { idUser } = req.params;
    let idUserQuery;
    if (idUser) {
      idUserQuery = idUser;
    } else {
      idUserQuery = req.user._id;
    }
    const chatByUser = await Chat.find({
      $or: [{ userOne: idUserQuery }, { userTwo: idUserQuery }],
    })
      .populate("messages")
      .populate("userTwo")
      .populate("userOne");

    if (chatByUser) {
      return res.status(200).json(chatByUser);
    } else {
      return res.status(404).json("no se ha encontrado ningún chat ");
    }
  } catch (error) {
    return res.status(404).json(error.message);
  }
};

//! ---------------------------------------------------------------------
//? -------------------------------get all chats------------------------------
//! ---------------------------------------------------------------------

const getAllChats = async (req, res, next) => {
  try {
    const allChats = await Chat.find().populate("messages");
    /** el find nos devuelve un array */
    if (allChats.length > 0) {
      return res.status(200).json(allChats);
    } else {
      return res.status(404).json("no se han encontrado chats");
    }
  } catch (error) {
    return res.status(404).json({
      error: "error al buscar - lanzado en el catch",
      message: error.message,
    });
  }
};

module.exports = {
  deleteChat,
  getChatById,
  getChatByUser,
  getAllChats,
  createEmptyChat,
};
