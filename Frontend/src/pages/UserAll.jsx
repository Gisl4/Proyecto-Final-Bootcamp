import { useState, useEffect } from "react";
import { useErrorUser } from "../hooks";
import { getAll } from "../services/user.service";
import { CardUser } from "../components/CardUser";

export const UserAll = () => {
  const [users, setUsers] = useState([]);
  const [res, setRes] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      const result = await getAll();
      result.status === 200 && setUsers(result.data.data);
    };
    fetchUsers();
  }, []);

  return (
    <div id="containerCountryAll">
      {users.length !== 0 ? (
        users.map((item) => (
          <CardUser data={item} key={item._id} setUsers={setUsers} />
        ))
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
};
