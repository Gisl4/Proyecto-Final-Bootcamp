import { NavLink, Outlet } from "react-router-dom";
import "./App.css";
import { Footer, Header } from "./components";

const App = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default App;

//!------- Ejemplo, FORMA DE HACERLO 1 Funciona ok (NEKY)  Esta forma de hacerlo es sin utilizar el archivo de rutas, incluyendo los navlink uno a uno y sin utilizar un componente como NAV
//!----- los componentes de header ni footer, haciendolo con etiquetas.
// import { NavLink, Outlet } from "react-router-dom";
// import "./App.css";

// const App = () => {
//   return (
//     <>
// <header>
//   <h1>Traviesos Extranjeros 🌎</h1>
// </header>
// <main className="main">
//   <nav className="navGeneral">
//     <NavLink to="">Home</NavLink>
//     <NavLink to="experiences">Experiences</NavLink>
//     <NavLink to="events">Events</NavLink>
//   </nav>
//   <Outlet />
// </main>
// <footer>Hecho con amor 💜</footer>
//     </>
//   );
// };

// export default App;

//!------- Ejemplo forma de hacerlo 2. Funciona ok  (NEKY)  Esta forma de hacerlo utilizando el archivo de rutas,
//!----- y incluyendo los componentes de header ni footer
// import { Header, Footer } from "./components";
// import { Outlet } from "react-router-dom";
// const App = () => {
//   return (
//     <>
//       <Header />
//       <main>
//         <Outlet />
//       </main>
//       <Footer />
//     </>
//   );
// };

// export default App;
