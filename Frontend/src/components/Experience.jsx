import "./Experience.css";
import { Comments } from "./index";
import { useAuth } from "../context/authContext";
import { useState, useRef } from "react";
import { toggleLikeExperience } from "../services/experiences.service";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const Experience = ({
  renderData,
  setExperiences,
  profile,
  handleDeleteExperience,
  handleUpdateExperience,
  userAuth,
}) => {
  const { _id, image, name, likes, events, description } = renderData;
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const spanFollowRef = useRef(null);
  const { user } = useAuth();
  const [commentsCounter, setCommentsCounter] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      setCommentsCounter(renderData?.comments?.length);
    };
    fetchEvent();
  }, []);

  const onToggleComments = (event) => {
    event.preventDefault();
    setOpen(!open);
  };

  function updateCommentsCounter(commentsCount) {
    setCommentsCounter(commentsCount);
  }

  return (
    <figure key={_id} className="card">
      <img src={image} alt={name} width={350} height={200} />

      {handleDeleteExperience && (
        <button onClick={() => handleDeleteExperience(_id)}>
          <span className="material-symbols-outlined">delete</span>
        </button>
      )}
      {handleUpdateExperience && (
        <button onClick={() => navigate(`/experiences/update/${_id}`)}>
          <span className="material-symbols-outlined">update</span>
        </button>
      )}
      <h3>{name}</h3>
      <p>Descripción: {description}</p>

      <div className="comment-icon-padding">
        <span
          className="material-symbols-outlined event-comment-experience-icon"
          onClick={onToggleComments}
        >
          mode_comment
        </span>
        <p
          className={
            commentsCounter > 9
              ? "comments-likes-counter-experiences"
              : "comments-likes-counter comments-likes-counter-2-experiences"
          }
        >
          {commentsCounter ? commentsCounter : ""}
        </p>
      </div>
      <div>
        {open ? (
          <>
            <Comments
              selectedRecipient={_id}
              commentsProps={renderData.comments}
              updateCommentsCounter={updateCommentsCounter}
            />
            <div className="close-chat-wrapper">
              <span
                onClick={onToggleComments}
                className="material-symbols-outlined"
              >
                close
              </span>
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </figure>
  );
};
