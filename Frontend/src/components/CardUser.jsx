import { useRef, useState } from "react";
import "./CardUser.css";
import { useAuth } from "../context/authContext";
import { followUserToggle } from "../services/user.service";

export const CardUser = ({ data, userById, setUsers }) => {
  const { name, city } = data;
  const { user } = useAuth();

  const spanFollowRef = useRef(null);

  const followUser = async (idUserSeQuiereSeguir) => {
    try {
      const res = await followUserToggle(idUserSeQuiereSeguir);
      if (res.status == 200) {
        console.log("entro");
        setUsers(res.data.allUser);
      }
    } catch (error) {
      //   console.error("Error al seguir al usuario", error);
    }
  };
  console.log("data del follow", data);

  return (
    <div className="cardUser">
      <img src={data?.image} alt={data?.name} />
      <p> {name}</p>
      <p>{city?.name}</p>
      {console.log(
        "userById?.followes?.includes(data._id)",
        data?.followers?.includes(user._id)
      )}
      <span
        ref={spanFollowRef}
        className={
          data?.followers?.includes(user._id)
            ? "material-symbols-outlined person_add"
            : "material-symbols-outlined"
        }
        onClick={() => followUser(data._id)}
      >
        person_add
      </span>
    </div>
  );
};
