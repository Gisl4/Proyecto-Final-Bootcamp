import { useState, useEffect, useRef } from "react";
import "./Comments.css";
import { useErrorRegister } from "../hooks";
import { useAuth } from "../context/authContext";
import {
  createMessage,
  toggleLikeMessage,
  deleteMessage,
  updateMessage,
} from "../services/message.service";
import { getChatLastMessageHour } from "../utils";
import { useNavigate } from "react-router-dom";
import { getChatByUser, createEmptyChat } from "../services/chats.service";

import { useForm } from "react-hook-form";

export const Comments = ({
  selectedRecipient,
  commentsProps,
  updateCommentsCounter,
}) => {
  //! 1) crear los estados

  const [send, setSend] = useState(false);
  const [ok, setOk] = useState(false);
  const { allUser, setAllUser, bridgeData } = useAuth();
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [commentToModify, setCommentToModify] = useState(undefined);
  const [res, setRes] = useState({});
  const user = JSON.parse(localStorage.getItem("user"));
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef();
  const navigate = useNavigate();
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
    if (user && isLoading && selectedRecipient) {
      async function fetchComments() {
        try {
          // await async "fetchComments()" function
          await setComments(commentsProps);
          setIsLoading(false);

          bridgeData("ALLUSER");
        } catch (err) {
          console.log("Error occured when fetching comments");
        }
      }
      fetchComments();
    }
  }, [isLoading]);

  useEffect(() => {
    console.log("allUser 🤡", allUser);
  }, [allUser]);

  useEffect(() => {
    scrollToBottom();
  }, [comments]);
  //! 5) estados de navegacion

  if (isLoading) {
    return <h1>cargando...</h1>;
  }

  async function onClickUserName(commentOwnerId) {
    const chatsResponse = await getChatByUser(user._id);

    if (commentOwnerId != user._id) {
      let chatFilteredByCommentOwnerId = chatsResponse.data.filter(
        (chat) =>
          chat.userTwo._id == commentOwnerId ||
          chat.userOne._id == commentOwnerId
      );
      let selectedChatId = undefined;
      if (chatFilteredByCommentOwnerId.length > 0) {
        selectedChatId = chatFilteredByCommentOwnerId[0]?._id;
      } else {
        const newChat = await createEmptyChat(commentOwnerId);
        selectedChatId = newChat.data.chat?._id;
      }

      navigate({
        pathname: "/chats",
        search: `?selectedChatId=${selectedChatId}`,
      });
    }
  }

  async function onToggleLike(comment) {
    const updatedMessage = await toggleLikeMessage(comment._id);

    let commentsToUpdate = [...comments];
    const indexOfMessageToReplace = commentsToUpdate.findIndex(
      (message) => message._id == updatedMessage.data?.message?._id
    );
    commentsToUpdate[indexOfMessageToReplace] = updatedMessage.data.message;

    setComments(commentsToUpdate);
  }

  async function onDeleteMessage(commentToDelete) {
    const updatedMessage = await deleteMessage(commentToDelete._id);

    let commentsToUpdate = [...comments];
    commentsToUpdate = commentsToUpdate.filter(
      (comment) => comment._id != commentToDelete._id
    );

    setComments(commentsToUpdate);
    updateCommentsCounter(commentsToUpdate.length);
  }

  function onSetCommentToModify(commentToModify) {
    setCommentToModify(commentToModify);
    setCommentContent(commentToModify.content);
  }

  const formSubmit = async (formData) => {
    if (commentToModify) {
      modifyComment(formData);
    } else {
      createComment(formData);
    }
  };

  async function createComment(formData) {
    const customFormData = {
      ...formData,
      type: "public",
    };
    //llamada al backend
    setSend(true);

    const newComment = await createMessage(selectedRecipient, customFormData);
    let commentsToUpdate = [
      ...comments,
      newComment.data.recipient.comments.at(-1),
    ];
    setComments(commentsToUpdate);
    setRes(newComment.data);
    setCommentContent("");
    setSend(false);
    updateCommentsCounter(commentsToUpdate.length);

    reset();
  }

  async function modifyComment(formData) {
    const customFormData = {
      ...formData,
      type: "public",
    };
    //llamada al backend
    setSend(true);

    const commentModified = await updateMessage(
      commentToModify._id,
      customFormData
    );

    commentToModify.content = commentContent;

    let commentsToUpdate = [...comments];
    const indexOfMessageToReplace = commentsToUpdate.findIndex(
      (message) => message._id == commentToModify._id
    );
    commentsToUpdate[indexOfMessageToReplace] = commentToModify;

    setComments(commentsToUpdate);
    setRes(commentModified.data);
    setCommentToModify(undefined);
    setCommentContent("");
    setSend(false);
    reset();
  }

  const onTodoChange = (event) => {
    setCommentContent(event.target.value);
    setValue("content", event.target.value);
  };

  return (
    <>
      <div className="chat-wrapper">
        {comments && comments.length > 0 ? (
          <div className="text-div">
            {comments?.map((comment) => (
              <div
                key={comment?._id}
                className={
                  user._id == comment?.owner || user._id == comment?.owner?._id
                    ? "my-text-wrapper"
                    : "friend-text-wrapper"
                }
              >
                <div
                  className={
                    user._id == comment?.owner ||
                    user._id == comment?.owner?._id
                      ? "my-text"
                      : "friend-text-comments"
                  }
                >
                  <div className="comments-header">
                    <>
                      {user._id == comment?.owner ||
                      user._id == comment?.owner?._id ? (
                        <div
                          onMouseEnter={(e) => {
                            setHoveredElement(comment?._id);
                          }}
                          onMouseLeave={(e) => {
                            setHoveredElement(undefined);
                          }}
                          className="comments-settings-wrapper"
                        >
                          <span className="material-symbols-outlined comments-actions-icon">
                            more_horiz
                          </span>

                          <div
                            className="comments-settings-actions"
                            style={
                              hoveredElement == comment?._id
                                ? { display: "flex" }
                                : { display: "none" }
                            }
                          >
                            <div className="comments-likes-wrapper">
                              <span
                                className={
                                  comment?.likes?.find(
                                    (userFav) => userFav?._id == user?._id
                                  )
                                    ? "material-symbols-outlined like comments-actions-icon"
                                    : "material-symbols-outlined comments-actions-icon"
                                }
                                onClick={() => onToggleLike(comment)}
                              >
                                favorite
                              </span>
                              <p
                                className={
                                  comment?.likes?.length > 9
                                    ? "comments-likes-counter"
                                    : "comments-likes-counter comments-likes-counter-2"
                                }
                              >
                                {comment?.likes?.length > 0
                                  ? comment?.likes?.length
                                  : ""}
                              </p>
                            </div>
                            <span
                              className="material-symbols-outlined comments-actions-icon"
                              onClick={() => onSetCommentToModify(comment)}
                            >
                              edit
                            </span>
                            <span
                              onClick={() => onDeleteMessage(comment)}
                              className="material-symbols-outlined comments-actions-icon"
                            >
                              delete
                            </span>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </>
                    <h5 onClick={() => onClickUserName(comment?.owner?._id)}>
                      {comment?.owner?.name}:
                    </h5>

                    <>
                      {user._id != comment?.owner?._id ? (
                        <div className="friend-like-wrapper-comments">
                          <span
                            className={
                              comment.likes.find(
                                (userFav) => userFav?._id == user?._id
                              )
                                ? "material-symbols-outlined like"
                                : "material-symbols-outlined"
                            }
                            onClick={() => onToggleLike(comment)}
                          >
                            favorite
                          </span>
                        </div>
                      ) : (
                        ""
                      )}
                    </>
                  </div>

                  <div className="comment-and-hour">
                    <p> {comment?.content}</p>
                    <small className="chat-time">
                      {getChatLastMessageHour(comment?.createdAt)}
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <h3>No comments</h3>
        )}
        <div ref={messagesEndRef} />
        <form
          id="formulario"
          onSubmit={handleSubmit(formSubmit)}
          onChange={onTodoChange}
        >
          <label htmlFor="content">Escribe tu mensaje:</label>
          <textarea
            id="content"
            className="textarea-message"
            name="content"
            value={commentContent}
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
              {send ? "Cargando..." : "New comment"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
