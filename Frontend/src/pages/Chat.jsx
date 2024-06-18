import { useState, useEffect, componentDidMount, useRef } from "react";
import "./Chat.css";
import { useErrorRegister } from "../hooks";
import { useAuth } from "../context/authContext";
import { getChatById } from "../services/chats.service";
import {
  createMessage,
  toggleLikeMessage,
  deleteMessage,
  updateMessage,
} from "../services/message.service";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { getChatLastMessageHour } from "../utils";

export const ChatPage = ({ selectedChat, updateChatHour }) => {
  //! 1) crear los estados
  const { chatId } = useParams();
  const [send, setSend] = useState(false);
  const [ok, setOk] = useState(false);
  const { allUser, setAllUser, bridgeData } = useAuth();
  const [chat, setChat] = useState(null);
  const [res, setRes] = useState({});
  const user = JSON.parse(localStorage.getItem("user"));
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef();
  const [style, setStyle] = useState({ display: "none" });
  const [messageContent, setMessageContent] = useState("");
  const [messageToModify, setMessageToModify] = useState(undefined);
  const [hoveredElement, setHoveredElement] = useState(undefined);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "center",
    });
  };

  const { register, handleSubmit, setValue, reset } = useForm();

  //! 4) useEffects que gestionan la repuesta y manejan los errores

  useEffect(() => {
    useErrorRegister(res, setRes, setOk);
    if (user && isLoading) {
      async function fetchChat() {
        try {
          if (selectedChat) {
            var chatResponse = await getChatById(selectedChat);
          } else {
            var chatResponse = await getChatById(chatId);
          }
          // await async "fetchChat()" function

          await setChat(chatResponse.data);
          setIsLoading(false);

          bridgeData("ALLUSER");
        } catch (err) {
          console.log("Error occured when fetching chat");
        }
      }
      fetchChat();
    }
  }, [isLoading]);

  useEffect(() => {
    console.log("allUser 🤡", allUser);
  }, [allUser]);

  useEffect(() => {
    scrollToBottom();
  }, [chat]);
  //! 5) estados de navegacion

  if (isLoading) {
    return <h1>cargando...</h1>;
  }

  const formSubmit = async (formData) => {
    if (messageToModify) {
      modifyMessage(formData);
    } else {
      createMessagePost(formData);
    }
  };

  const createMessagePost = async (formData) => {
    const customFormData = {
      ...formData,
      type: "private",
    };
    //llamada al backend
    setSend(true);

    var recipientId = chat.userTwo._id;

    if (user._id == chat.userTwo._id) {
      recipientId = chat.userOne._id;
    }
    const newMessage = await createMessage(recipientId, customFormData);
    chat.messages = [...chat.messages, newMessage.data.comment];
    await setChat(chat);
    setRes(newMessage.data);
    setSend(false);
    setMessageContent("");
    updateChatHour(chat);
    reset();
  };

  async function modifyMessage(formData) {
    const customFormData = {
      ...formData,
      type: "public",
    };
    //llamada al backend
    setSend(true);

    const messageModified = await updateMessage(
      messageToModify._id,
      customFormData
    );

    messageToModify.content = messageContent;

    let chatToUpdate = { ...chat };
    const indexOfMessageToReplace = chatToUpdate.messages.findIndex(
      (message) => message._id == messageToModify._id
    );
    chatToUpdate.messages[indexOfMessageToReplace] = messageToModify;

    await setChat(chatToUpdate);
    setMessageToModify(undefined);
    setMessageContent("");
    setSend(false);
    reset();
  }

  const onTodoChange = (event) => {
    setMessageContent(event.target.value);
    setValue("content", event.target.value);
  };

  function onSetMessageToModify(messageToModify) {
    setMessageToModify(messageToModify);
    setMessageContent(messageToModify.content);
  }

  async function onToggleLike(message) {
    const updatedMessage = await toggleLikeMessage(message._id);
    let chatToUpdate = { ...chat };
    const indexOfMessageToReplace = chatToUpdate.messages.findIndex(
      (message) => message._id == updatedMessage.data.message._id
    );
    chatToUpdate.messages[indexOfMessageToReplace] =
      updatedMessage.data.message;

    await setChat(chatToUpdate);
  }

  async function onDeleteMessage(messageToDelete) {
    const updatedMessage = await deleteMessage(messageToDelete._id);

    let chatToUpdate = { ...chat };
    let messagesToUpdate = chatToUpdate.messages.filter(
      (message) => message._id != messageToDelete._id
    );
    chatToUpdate.messages = messagesToUpdate;
    updateChatHour(chatToUpdate);

    await setChat(chatToUpdate);
  }

  return (
    <>
      <div className="chat-wrapper">
        <div className="chat-header-wrapper">
          <img
            className="chat-user-image"
            src={chat.userTwo.image}
            alt="user"
          />
          <h3>{chat.userTwo.name}</h3>
        </div>
        {chat && chat.messages && chat.messages.length > 0 ? (
          <div className="text-div">
            {chat.messages.map((message) => (
              <div
                key={message._id}
                className={
                  user._id == message.owner || user._id == message.owner._id
                    ? "my-text-message-wrapper"
                    : "friend-text-message-wrapper"
                }
              >
                {user._id == message.owner || user._id == message.owner._id ? (
                  <div
                    onMouseEnter={(e) => {
                      setHoveredElement(message?._id);
                    }}
                    onMouseLeave={(e) => {
                      setHoveredElement(undefined);
                    }}
                    className="messages-settings-wrapper"
                  >
                    <span className="material-symbols-outlined messages-actions-icon">
                      more_horiz
                    </span>
                    <div
                      className="messages-settings-actions"
                      style={
                        hoveredElement == message?._id
                          ? { display: "flex" }
                          : { display: "none" }
                      }
                    >
                      <span
                        className={
                          message?.likes?.find(
                            (userFav) => userFav?._id == user._id
                          )
                            ? "material-symbols-outlined like icon-no-margin"
                            : "material-symbols-outlined messages-actions-icon"
                        }
                        onClick={() => onToggleLike(message)}
                      >
                        favorite
                      </span>
                      <span
                        className="material-symbols-outlined messages-actions-icon"
                        onClick={() => onSetMessageToModify(message)}
                      >
                        edit
                      </span>
                      <span
                        onClick={() => onDeleteMessage(message)}
                        className="material-symbols-outlined messages-actions-icon"
                      >
                        delete
                      </span>
                    </div>
                  </div>
                ) : (
                  <span
                    className={
                      message?.likes?.find(
                        (userFav) => userFav?._id == user._id
                      )
                        ? "material-symbols-outlined like friend-like"
                        : "material-symbols-outlined friend-like"
                    }
                    onClick={() => onToggleLike(message)}
                  >
                    favorite
                  </span>
                )}

                <div
                  className={
                    user._id == message.owner || user._id == message.owner._id
                      ? "my-text-message"
                      : "friend-message-text"
                  }
                >
                  {message.content}
                </div>
                <small className="chat-time">
                  {getChatLastMessageHour(message?.createdAt)}
                </small>
              </div>
            ))}
          </div>
        ) : (
          <h3>You have no messages</h3>
        )}
        <div ref={messagesEndRef} />
        <form
          id="formularios"
          onSubmit={handleSubmit(formSubmit)}
          onChange={onTodoChange}
        >
          <label htmlFor="content">Escribe tu mensaje:</label>
          <textarea
            id="content"
            className="textarea-message"
            name="content"
            value={messageContent}
            {...register("content", { required: true })}
            required
          />

          <div className="btn_container">
            <button
              className="btn"
              type="submit"
              disabled={send}
              style={{ background: send ? "#49c1a388" : "#2f7a67" }}
            >
              {send ? "Cargando..." : "New message"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
