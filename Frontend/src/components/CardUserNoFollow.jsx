import "./CardUser.css";

export const CardUserNoFollow = ({ data }) => {
  const { name } = data;

  return (
    <div className="cardUser">
      <img src={data?.image} alt={data?.name} />
      <p> {name}</p>
    </div>
  );
};
