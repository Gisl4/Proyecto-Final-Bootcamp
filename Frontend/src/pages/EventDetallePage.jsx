import { EventDetalle } from "../components";
import { Outlet } from 'react-router-dom';

export const EventDetallePage = () => {
  return (
    <div>
      <EventDetalle />
      <Outlet/>
    </div>
  );
};
