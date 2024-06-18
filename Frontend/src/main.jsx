import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter, Route, RouterProvider, Routes } from "react-router-dom";
import "./index.css";
import {  Homepages } from "./pages";
import { router } from "./routes/routes.jsx";
import { AuthContextProvider } from "./context/authContext.jsx";
import "./pages/ExperiencesPage.jsx";
import "./pages/Eventspages.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContextProvider>
      <RouterProvider router={router} />
      
    </AuthContextProvider>
  </React.StrictMode>
);

//!---- FORMA DE HACERLO 1 SIN ROUTER FUNCIONA OK --------- (NEKY) Esta forma de hacerlo sería con el browse router sin pasar por el archivo de rutas
//!---- Poniendo las rutas una a una en el main
// <BrowserRouter basename="/">
//   <Routes>
//     <Route path="/" element={<App />}>
//       <Route index element={<Homepages />} />
//       <Route path="experiences" element={<ExperiencesPage />} />
//       <Route path="events" element={<EventsPages />} />
//       {/* <Route path="events" element={} /> */}
//       <Route
//         path="*"
//         element={
//           <main>
//             <p>Error 404 - No existe la ruta!</p>
//           </main>
//         }
//       ></Route>
//     </Route>
//   </Routes>
// </BrowserRouter>;

//!---- FORMA DE HACERLO 2 CON ROUTER FUNCIONA OK --------- (NEKY) Esta forma de hacerlo sería utilizando el router provider importando el archivo de rutas
// <React.StrictMode>
//   <RouterProvider router={router} />;
// </React.StrictMode>;

