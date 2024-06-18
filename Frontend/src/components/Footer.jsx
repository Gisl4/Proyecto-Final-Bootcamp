import React from 'react';
import { Link } from 'react-router-dom'; // Asegúrate de importar Link desde react-router-dom
import "./Footer.css";

export const Footer = () => {
  return (
    <footer>
      <Link to="/AboutPage">
        <button>Sobre Nosotros</button>
      </Link>
      <h3>Hecho con amor 💜</h3>
    </footer>
  );
};
