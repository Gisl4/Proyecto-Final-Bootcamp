const Chat = require("../models/Chat.model");
const Message = require("../models/Message.model");
const Event = require("../models/Events.model");
const Experience = require("../models/Experience.model");
const User = require("../models/User.model");
const enumMessageTypeOk = require("../../utils/enumMessageTypeOk");

/**+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 * ++++++++++++++++++++++++++-------C R U D--------+++++++++++++++++++++++++++++++++++
 * +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 */
//! ---------------------------------------------------------------------
//? -------------------------------POST create --------------------------
//! ---------------------------------------------------------------------

const createMessage = async (req, res, next) => {
  try {
    const { type, content } = req.body;
    const { idRecipient } = req.params; // -----> id del objetivo del comentario
    /**
     * idRecipient puede ser el id de : experience, user
     */

    const findUser = await User.findById(idRecipient);
    const findExperience = await Experience.findById(idRecipient);
    const findEvent = await Event.findById(idRecipient);

    /**
     * cuando no lo encuentre devuelve un null y el que encuentre va a devolver el objeto encontrado
     *
     */

    if (findUser) {
      req.body["owner"] = req.user;
      const newMessage = new Message(req.body);
      const savedMessage = await newMessage.save();

      if (type == "private") {
        try {
          const chatExistOne = await Chat.findOne({
            userOne: req.user._id,
            userTwo: findUser._id,
          });
          const chatExistTwo = await Chat.findOne({
            userOne: findUser._id,
            userTwo: req.user._id,
          });

          /**
           * si no tengo ningun chat abierto con el otro usuario ambas constantes
           * serán null
           *
           * Si tengo abierto un chat con ese usuario una de las dos constantes tendra valor y la
           * otra sera null
           */

          if (chatExistOne != null || chatExistTwo != null) {
            //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            // ---------------------------- CHAT EXISTE: TENEMOS QUE ACTUALIZARLO -------------------------------------
            //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            ///&/ existe un chat y entonces lo actualizamos conm el nuevo mensaje

            if (chatExistOne) {
              try {
                await chatExistOne.updateOne({
                  /** podemos hacer un push */
                  $push: { messages: newMessage._id },
                });
                try {
                  await User.findByIdAndUpdate(req.user._id, {
                    $push: {
                      postedMessages: newMessage._id,
                    },
                  });
                  await User.findByIdAndUpdate(findUser._id, {
                    $push: {
                      commentsPublicByOther: newMessage._id,
                    },
                  });
                  return res.status(200).json({
                    chat: await Chat.findById(chatExistOne._id).populate(
                      "messages  userOne  userTwo"
                    ),
                    comment: newMessage,
                  });
                } catch (error) {
                  return res.status(404).json({
                    error:
                      "no hemos actualizado el user en la clave postedMessages",
                    idMessage: newMessage._id,
                  });
                }
              } catch (error) {
                await Message.findByIdAndDelete(savedMessage._id);
                return res
                  .status(404)
                  .json(
                    "error en actualizar el chat existente, elimino el comentario"
                  );
              }
            } else {
              try {
                await chatExistTwo.updateOne({
                  $push: { messages: newMessage._id },
                });

                try {
                  await User.findByIdAndUpdate(req.user._id, {
                    $push: {
                      postedMessages: newMessage._id,
                    },
                  });
                  await User.findByIdAndUpdate(findUser._id, {
                    $push: {
                      commentsPublicByOther: newMessage._id,
                    },
                  });
                  return res.status(200).json({
                    chat: await Chat.findById(chatExistTwo._id).populate(
                      "messages  userOne  userTwo"
                    ),
                    comment: newMessage,
                  });
                } catch (error) {
                  return res.status(404).json({
                    error:
                      "no hemos actualizado el user en la clave postedMessages",
                    idMessage: newMessage._id,
                  });
                }
              } catch (error) {
                try {
                  await Message.findByIdAndDelete(savedMessage._id);
                  return res
                    .status(404)
                    .json(
                      "error en actualizar el chat existente, elimino el comentario"
                    );
                } catch (error) {
                  return res
                    .status(404)
                    .json(
                      "no he borrado el coment  ni tampoco he actualizdo el chat existente"
                    );
                }
              }
            }
          } else {
            //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            // ---------------------------- CREAR CHAT PORQUE NO EXISTE NINGUNO ---------------------------------------
            //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            /// crear un chat con el comentario que hemos creado

            const newChat = new Chat({
              userOne: req.user._id,
              userTwo: findUser._id,
              messages: [savedMessage._id],
            });

            try {
              await newChat.save();

              try {
                await User.findByIdAndUpdate(req.user._id, {
                  $push: {
                    postedMessages: newMessage._id,
                    chats: newChat._id,
                  },
                });

                try {
                  await User.findByIdAndUpdate(idRecipient, {
                    $push: {
                      commentsPublicByOther: newMessage._id,
                      chats: newChat._id,
                    },
                  });

                  return res.status(200).json({
                    chat: await Chat.findById(newChat._id).populate(
                      "messages  userOne  userTwo"
                    ),
                    comment: newMessage,
                  });
                } catch (error) {
                  return res.status(404).json({
                    error:
                      "no hemos actualizado el user que recibe el comentario la clave chat",
                    idMessage: newMessage._id,
                  });
                }
              } catch (error) {
                return res.status(404).json({
                  error:
                    "no hemos actualizado el user el dueño del mensaje en la clave postedMessages y en la clave chats",
                  idMessage: newMessage._id,
                });
              }
            } catch (error) {
              // lo borramos porque no nos ha enviado bien el tipo
              try {
                await Message.findByIdAndDelete(savedMessage._id);
                return res.status(404).json(error.message);
              } catch (error) {
                return res.status(404).json({
                  error:
                    "no se ha creado el chat pero no se ha borrado el comentario",

                  idMensageNoBorrado: savedMessage._id,
                });
              }
            }
          }
        } catch (error) {
          return res.status(404).json(error.message);
        }
      } else if (type == "public") {
        try {
          await User.findByIdAndUpdate(req.user._id, {
            $push: {
              postedMessages: newMessage._id,
            },
          });

          try {
            await User.findByIdAndUpdate(idRecipient, {
              $push: {
                commentsPublicByOther: newMessage._id,
              },
            });

            return res.status(200).json({
              userOwner: await User.findById(req.user._id).populate([
                {
                  path: "chats",
                  model: Chat,
                  populate: "messages userOne userTwo",
                },
              ]),
              recipient: await User.findById(idRecipient),
              comentario: newMessage._id,
            });
          } catch (error) {
            return res.status(404).json({
              error:
                "error catch update quien recibe el comentario  -  commentsPublicByOther",
              message: error.message,
            });
          }
        } catch (error) {
          return res.status(404).json({
            error:
              "error catch update quien hace el comentario  -  postedMessages",
            message: error.message,
          });
        }
      } else {
        return res.status(404).json("no has puesto el tipo correctamente");
      }
    } else if (findEvent) {
      if (type == "private") {
        return res.status(404).json("no puedes hacer comentarios privados");
      } else {
        try {
          req.body["owner"] = req.user;
          const newMessage = new Message(req.body);
          const savedMessage = await newMessage.save();

          try {
            await User.findByIdAndUpdate(req.user._id, {
              $push: {
                postedMessages: savedMessage._id,
              },
            });

            try {
              await Event.findByIdAndUpdate(findEvent._id, {
                $push: { comments: savedMessage._id },
              });

              return res.status(200).json({
                userOwner: await User.findById(req.user._id).populate(
                  "postedMessages"
                ),
                recipient: await Event.findById(findEvent._id).populate({
                  path: "comments",
                  populate: [{ path: "owner" }, { path: "likes" }],
                }),
              });
            } catch (error) {
              return res.status(404).json({
                error: "error catch update Event - comments",
                message: error.message,
              });
            }
          } catch (error) {
            return res.status(404).json({
              error:
                "error catch update userOwner del comentario  -  postedMessages",
              message: error.message,
            });
          }
        } catch (error) {
          return res.status(404).json({
            error: "error catch save message",
            message: error.message,
          });
        }
      }
    } else if (findExperience) {
      if (type == "private") {
        return res.status(404).json("no puedes hacer comentarios privados");
      } else {
        try {
          req.body["owner"] = req.user;
          const newMessage = new Message(req.body);
          const savedMessage = await newMessage.save();

          try {
            await User.findByIdAndUpdate(req.user._id, {
              $push: {
                postedMessages: savedMessage._id,
              },
            });

            try {
              await Experience.findByIdAndUpdate(findExperience._id, {
                $push: { comments: savedMessage._id },
              });

              return res.status(200).json({
                userOwner: await User.findById(req.user._id).populate(
                  "postedMessages"
                ),
                recipient: await Experience.findById(
                  findExperience._id
                ).populate({
                  path: "comments",
                  populate: [{ path: "owner" }, { path: "likes" }],
                }),
              });
            } catch (error) {
              return res.status(404).json({
                error: "error catch update Experience - comments",
                message: error.message,
              });
            }
          } catch (error) {
            return res.status(404).json({
              error:
                "error catch update userOwner del comentario  -  postedMessages",
              message: error.message,
            });
          }
        } catch (error) {
          return res.status(404).json({
            error: "error catch save message",
            message: error.message,
          });
        }
      }
    }
  } catch (error) {
    return next(error);
  }
};

//! ---------------------------------------------------------------------
//? -------------------------------DELETE MESSAGE -------------------------------
//! ---------------------------------------------------------------------
const deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const message = await Message.findByIdAndDelete(id);
    if (message) {
      // lo buscamos para vr si sigue existiendo o no
      const finByIdMessage = await Message.findById(id);

      try {
        const removeMessageFromExperience = await Experience.updateMany(
          { message: id },
          { $pull: { message: id } }
        );
        try {
          const removeMessageFromChat = await Chat.updateMany(
            { messages: id },
            { $pull: { messages: id } }
          );
          try {
            const removeMessageFromEvent = await Event.updateMany(
              { messages: id },
              { $pull: { messages: id } }
            );
            try {
              await User.updateMany(
                { messagesFav: id },
                { $pull: { messagesFav: id } }
              );
              await User.updateMany(
                { postedMessages: id },
                { $pull: { postedMessages: id } }
              );
              await User.updateMany(
                { commentsPublicByOther: id },
                { $pull: { commentsPublicByOther: id } }
              );

              return res.status(finByIdMessage ? 404 : 200).json({
                deleteTest: finByIdMessage ? false : true,
              });
            } catch (error) {
              return res.status(404).json({
                error: "error catch update User",
                message: error.message,
              });
            }
          } catch (error) {
            return res.status(404).json({
              error: "error catch update Event",
              message: error.message,
            });
          }
        } catch (error) {
          return res.status(404).json({
            error: "error catch update Chat",
            message: error.message,
          });
        }
      } catch (error) {
        return res.status(404).json({
          error: "error catch update Experience",
          message: error.message,
        });
      }
    }
  } catch (error) {
    return res.status(404).json(error.message);
  }
};

//! ---------------------------------------------------------------------
//? -------------------------------UPDATE MESSAGE -------------------------------
//! ---------------------------------------------------------------------

const updateMessage = async (req, res, next) => {
  try {
    await Message.syncIndexes();
    const { id } = req.params;
    const messageById = await Message.findById(id);
    if (messageById) {
      const customBody = {
        _id: messageById._id,
        content: req.body?.content ? req.body?.content : messageById.content,
      };

      if (req.body?.type) {
        const resultEnum = enumMessageTypeOk(req.body?.type);
        customBody.type = resultEnum.check ? req.body?.type : messageById.type;
      }

      try {
        await Message.findByIdAndUpdate(id, customBody);

        // ...> Se busca el elemento actualizado a través de la ID

        const messageByIdUpdate = await Message.findById(id)
          .populate("likes")
          .populate("owner");

        // ......> Se coge el req.body y vamos a sacarle las claves para saber que elementos nos ha dicho de actualizar
        const elementUpdate = Object.keys(req.body);

        /** vamos a hacer un objeto vacio donde poder meter los test */

        let test = {};

        /** vamos a recorrer las claves del body y a crear un objeto con los test */

        elementUpdate.forEach((item) => {
          if (req.body[item] === messageByIdUpdate[item]) {
            test[item] = true;
          } else {
            test[item] = false;
          }
        });

        /** En caso de false, lanzamos un 404,
         * si no hay false, entonces lanzamos un 200 porque todo esta correcte
         */

        let acc = 0;
        for (clave in test) {
          test[clave] == false && acc++;
        }

        if (acc > 0) {
          return res.status(404).json({
            dataTest: test,
            update: false,
          });
        } else {
          return res.status(200).json({
            dataTest: test,
            update: true,
          });
        }
      } catch (error) {
        return res.status(404).json(error.message);
      }
    } else {
      return res.status(404).json("este mensaje no existe");
    }
  } catch (error) {
    return res.status(404).json(error.message);
  }
};

//! ---------------------------------------------------------------------
//? -------------------------------get message by id--------------------------
//! ---------------------------------------------------------------------
const getMessageById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const messageById = await Message.findById(id).populate("owner");
    if (messageById) {
      return res.status(200).json(messageById);
    } else {
      return res.status(404).json("no se ha encontrado el mensaje");
    }
  } catch (error) {
    return res.status(404).json(error.message);
  }
};

//! ---------------------------------------------------------------------
//? -------------------------------get message by user owner--------------------------
//! ---------------------------------------------------------------------

const getMessageByUserOwner = async (req, res, next) => {
  try {
    const { idUserOwner } = req.params;
    const messageByUserOwner = await Message.find({
      owner: idUserOwner,
    });
    if (messageByUserOwner) {
      return res.status(200).json(messageByUserOwner);
    } else {
      return res.status(404).json("no se ha encontrado ningún mensaje ");
    }
  } catch (error) {
    return res.status(404).json(error.message);
  }
};

//! ---------------------------------------------------------------------
//? -------------------------------get all messages------------------------------
//! ---------------------------------------------------------------------

const getAllMessages = async (req, res, next) => {
  try {
    const allMessages = await Message.find().populate("owner");
    /** el find nos devuelve un array */
    if (allMessages.length > 0) {
      return res.status(200).json(allMessages);
    } else {
      return res.status(404).json("no se han encontrado mensajes");
    }
  } catch (error) {
    return res.status(404).json({
      error: "error al buscar - lanzado en el catch",
      message: error.message,
    });
  }
};

//! ---------------------------------------------------------------------
//? -------------------------------Toggle like messages------------------------------
//! ---------------------------------------------------------------------

const toggleLikeMessage = async (req, res, next) => {
  try {
    const { idMessage } = req.params;
    // vamos a tener el middleware de auth por lo cual se crea req.user
    const { _id } = req.user;

    if (req.user.messagesFav.includes(idMessage)) {
      try {
        await User.findByIdAndUpdate(_id, {
          $pull: { messagesFav: idMessage },
        });

        try {
          await Message.findByIdAndUpdate(idMessage, {
            $pull: { likes: _id },
          });

          return res.status(200).json({
            action: "disliked",
            user: await User.findById(_id).populate("messagesFav"),
            message: await Message.findById(idMessage)
              .populate("likes")
              .populate("owner"),
          });
        } catch (error) {
          return res.status(404).json({
            error: "no update Message - likes",
            message: error.message,
          });
        }
      } catch (error) {
        return res.status(404).json({
          error: "no update user-  messagesFav",
          message: error.message,
        });
      }
    } else {
      try {
        await User.findByIdAndUpdate(_id, {
          $push: { messagesFav: idMessage },
        });

        try {
          await Message.findByIdAndUpdate(idMessage, {
            $push: { likes: _id },
          });

          return res.status(200).json({
            action: "like",
            user: await User.findById(_id).populate("messagesFav"),
            message: await Message.findById(idMessage)
              .populate("likes")
              .populate("owner"),
          });
        } catch (error) {
          return res.status(404).json({
            error: "no update Message - likes",
            message: error.message,
          });
        }
      } catch (error) {
        return res.status(404).json({
          error: "no update user-  messagesFav",
          message: error.message,
        });
      }
    }
  } catch (error) {
    return res.status(404).json(error.message);
  }
};

module.exports = {
  createMessage,
  deleteMessage,
  updateMessage,
  getAllMessages,
  getMessageById,
  getMessageByUserOwner,
  toggleLikeMessage,
};
