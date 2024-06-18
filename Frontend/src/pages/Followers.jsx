import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { useErrorUser } from "../hooks";
import { byId } from "../services/user.service";
import { CardUserNoFollow } from "../components/CardUserNoFollow";

export const Followers = ({}) => {
  const { user } = useAuth();
  console.log("Soy el usuario logado 🥑", user);
  const [resUser, setResUser] = useState([]);
  const [userById, setUserById] = useState(null);

  useEffect(() => {
    (async () => {
      setResUser(await byId(user._id));
    })();
  }, []);

  useEffect(() => {
    useErrorUser(resUser, setResUser, setUserById);

    console.log("Datos de los usuarios sigo", userById);
  }, [resUser]);
  console.log("user", resUser);

  return (
    <>
      <div id="containerCountryAll">
        <h3>Seguidos</h3>
        {userById != null ? (
          <>
            {userById.followed.map((item, index) => (
              <CardUserNoFollow
                data={item}
                key={item._id}
                userById={userById}
              />
              //   <li key={index}>{item.name}</li>
            ))}
          </>
        ) : (
          <p>No sigues a nadie</p>
        )}
      </div>
      <div id="containerCountryAll">
        <h3>Seguidores</h3>
        {userById != null ? (
          <>
            {userById.followers.map((item, index) => (
              <CardUserNoFollow data={item} key={item._id} />
            ))}
          </>
        ) : (
          <p>No tienes seguidores</p>
        )}
      </div>
    </>
  );
};
