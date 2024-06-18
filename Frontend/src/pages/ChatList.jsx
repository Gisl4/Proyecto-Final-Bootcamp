import { useState, useEffect } from "react";
import { ChatPage } from "./index";
import "./ChatList.css";
import { useErrorRegister } from "../hooks";
import { useAuth } from "../context/authContext";
import { getChatByUser, deleteChat } from "../services/chats.service";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getChatLastMessageHour } from "../utils";
export const ChatListPage = () => {
  //! 1) crear los estados

  const [ok, setOk] = useState(false);
  const { allUser, setAllUser, bridgeData } = useAuth();
  const [chats, setChats] = useState([]);
  const [res, setRes] = useState({});
  const user = JSON.parse(localStorage.getItem("user"));
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState(undefined);
  let [searchParams, setSearchParams] = useSearchParams();
  let selectedChatId = searchParams.get("selectedChatId");
  //! 4) useEffects que gestionan la repuesta y manejan los errores

  useEffect(() => {
    useErrorRegister(res, setRes, setOk);
    if (user && isLoading) {
      async function fetchChats() {
        try {
          // await async "fetchChats()" function
          const chatsResponse = await getChatByUser(user._id);

          await setChats(chatsResponse.data);
          if (selectedChatId) {
            setSelectedChat(selectedChatId);
          }
          setIsLoading(false);

          bridgeData("ALLUSER");
        } catch (err) {
          console.log("Error occured when fetching chats");
        }
      }
      fetchChats();
    }
  }, [isLoading]);

  useEffect(() => {
    console.log("allUser 🤡", allUser);
  }, [allUser]);

  //! 5) estados de navegacion

  if (isLoading) {
    return <h1>cargando...</h1>;
  }

  function selectChat(chat) {
    console.log(window.innerWidth);
    if (chat) {
      if (window.innerWidth > 760) {
        setSelectedChat(chat._id);
      } else {
        console.log("ENTRA");
        navigate(`/chat/${chat._id}`);
      }
    }
  }
  function updateChatHour(chatToUpdate) {
    let chatsToUpdate = [...chats];
    const indexOfChatToReplace = chatsToUpdate.findIndex(
      (chat) => chat._id == chatToUpdate._id
    );
    chatsToUpdate[indexOfChatToReplace] = chatToUpdate;
    setChats(chatsToUpdate);
  }
  async function onDeleteChat(chatToDelete) {
    const chatDeleted = await deleteChat(chatToDelete._id);
    let chatsToUpdate = chats.filter((chat) => chat._id != chatToDelete._id);
    if (chatsToUpdate.length > 0) {
      setSelectedChat(chatsToUpdate[0]._id);
    } else {
      setSelectedChat(null);
    }
    setChats(chatsToUpdate);
  }

  return (
    <>
      <div className="chat-page-container">
        <div className="chats-list-wrapper">
          <h2>Chats</h2>
          {chats && chats.length > 0 ? (
            <>
              {chats.map((chat) => (
                <div
                  className={
                    selectedChat && chat._id == selectedChat
                      ? "chat-list-wrapper selected"
                      : "chat-list-wrapper"
                  }
                  key={chat._id}
                  onClick={() => selectChat(chat)}
                >
                  <img
                    className="chat-list-image"
                    src={
                      user._id == chat.userOne._id
                        ? chat.userTwo?.image
                        : chat.userOne?.image
                    }
                    alt="user"
                  />
                  <div>
                    <h3>
                      {user._id == chat.userOne._id
                        ? chat.userTwo?.name
                        : chat.userOne?.name}
                    </h3>
                    <p className="chat-list-chat-content-message">
                      {chat.messages.at(-1)?.content}
                    </p>
                  </div>
                  <div className="chat-delete-and-hour-wrapper">
                    <span
                      onClick={() => onDeleteChat(chat)}
                      className="material-symbols-outlined delete-chat-icon"
                    >
                      delete
                    </span>

                    <small className="chats-time">
                      {chat.messages.at(-1)?.createdAt
                        ? getChatLastMessageHour(
                            chat.messages.at(-1)?.createdAt
                          )
                        : ""}
                    </small>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <h3>You have no chats</h3>
          )}
        </div>
        {selectedChat ? (
          <div key={selectedChat} className="chatPage-wrapper">
            <ChatPage
              selectedChat={selectedChat}
              updateChatHour={updateChatHour}
            />
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};
