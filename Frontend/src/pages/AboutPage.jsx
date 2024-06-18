import './AboutPage.css';

import AboutCard from './AboutCard';

export const AboutPage = () => {
  return (
    <main className="About">
      <h2>¡Bienvenido a Traviesos Extranjeros!</h2>
        
      <p>Hemos culminado nuestro proyecto final del Bootcamp de Desarrollo Web con gran entusiasmo. 
        Nuestro equipo de 7 integrantes ha creado "Traviesos Extranjeros", una red social innovadora
        para conectar viajeros con intereses afines y encontrar planes en diferentes países. Utilizando
        React, Node, Axios, Vite y MongoDB, hemos desarrollado una plataforma robusta y dinámica en JavaScript.
        <br></br>
        <br></br>
        Somos apasionados viajeros que creemos en la belleza de la diversidad y las conexiones humanas.
        Nuestra misión es conectar personas a través de experiencias auténticas y significativas mientras exploramos el mundo. 
        <br></br>
        En "Traviesos Extranjeros", cada destino ofrece la oportunidad de conocer personas increíbles,
        compartir experiencias y momentos inolvidables. Nuestra plataforma es un lugar para encontrar planes emocionantes,
        inspirarte, obtener consejos y vivir experiencias compartidas. Únete a nosotros y celebra la diversidad mientras exploramos el mundo juntos.</p>
        
        <p>¡Ven a explorar, aprender y conectar con gente maravillosa en "Traviesos Extranjeros"!</p>
        <br></br>
        
      <div className="about-cards">
        <AboutCard
          name={'Elena '}
          git={'https://github.com/Elenah1118'}
          linkedin={'...'}
          image={
            'https://res.cloudinary.com/dqiudrruv/image/upload/v1717035511/world-travel-graphic-clipart-design-free-png_uybrql.png'
          }
        />
        <AboutCard
          name={'Gisell'}
          git={'https://github.com/Gisl4'}
          linkedin={'https://www.linkedin.com/in/gisell-l%C3%B3pez-rosado-aa42b028a/'}
          image={
            'https://res.cloudinary.com/dqiudrruv/image/upload/v1717366160/Fotos%20Integrantes%20del%20Equipo/Gisell_Lopez_aifgi6.jpg'
          }
        />
        <AboutCard
          name={'Leticia'}
          git={'https://github.com/LetiLorenzo'}
          linkedin={'...'}
          image={
            'https://res.cloudinary.com/dqiudrruv/image/upload/v1717035511/world-travel-graphic-clipart-design-free-png_uybrql.png'
          }
        />
        <AboutCard
          name={'Nerea'}
          git={'https://github.com/NekyyM'}
          linkedin={'https://www.linkedin.com/in/nereamolina/'}
          image={
            'https://res.cloudinary.com/dqiudrruv/image/upload/v1717365987/Fotos%20Integrantes%20del%20Equipo/Nerea_gbuwmh.jpg'
          }
        />
        <AboutCard
          name={'Beatriz'}
          git={'https://github.com/BeatrizGF90'}
          linkedin={'https://es.linkedin.com/in/beatrizgonzalezfernandez90'}
          image={
            'https://res.cloudinary.com/dqiudrruv/image/upload/v1717575638/Fotos%20Integrantes%20del%20Equipo/beatriz_2_ggzkzf.png'
          }
        />
        <AboutCard
          name={'Sergio'}
          git={'https://github.com/Sergiolmos4'}
          linkedin={'...'}
          image={
            'https://res.cloudinary.com/dqiudrruv/image/upload/v1717035511/world-travel-graphic-clipart-design-free-png_uybrql.png'
          }
        />
        <AboutCard
          name={'Andreu'}
          git={'https://github.com/Andreu-AB'}
          linkedin={'...'}
          image={
            'https://res.cloudinary.com/dqiudrruv/image/upload/v1717035511/world-travel-graphic-clipart-design-free-png_uybrql.png'
          }
        />
      </div>
    </main>
  );
};
export default AboutPage;