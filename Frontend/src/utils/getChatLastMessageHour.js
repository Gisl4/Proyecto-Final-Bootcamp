export const getChatLastMessageHour = (lastMessageDate) => {
  const lastMessageHour =
    (new Date(lastMessageDate).getHours() < 10 ? "0" : "") +
    new Date(lastMessageDate).getHours() +
    ":" +
    (new Date(lastMessageDate).getMinutes() < 10 ? "0" : "") +
    new Date(lastMessageDate).getMinutes();
  return lastMessageHour;
};
