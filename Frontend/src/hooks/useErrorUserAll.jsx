export const useErrorUserAll = (result, setUsers) => {
  if (!result || !result.data) {
    console.log("No encuentro la data de usuarios");
    setUsers([]);
    return;
  }

  setUsers(result.data);
};
