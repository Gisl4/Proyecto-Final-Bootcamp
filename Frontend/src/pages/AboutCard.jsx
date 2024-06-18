import React from 'react';

export const AboutCard = ({ name, linkedin, git, image }) => {
  return (
    <div>
      <div className="about">
        <div className="about-info">
          <div
            className="about-avatar"
            style={{ backgroundImage: `url(${image})` }}
          ></div>
          <div className="about-title">{name}</div>
          <div className="about-subtitle">Jr. Fullstack Developer</div>
        </div>
        <ul className="about-social">
          <li className="about-social__item">
            <a target="_blank" rel="noreferrer" href={git}>
              <img
                src="https://res.cloudinary.com/dqiudrruv/image/upload/v1717035016/Fotos%20Integrantes%20del%20Equipo/free-github-169-1174970_t3pqfu.webp"
                alt="logogit"
              />
            </a>
          </li>
          <li className="about-social__item">
            <a target="_blank" rel="noreferrer" href={linkedin}>
              <img
                src="https://res.cloudinary.com/dqiudrruv/image/upload/v1717035134/Fotos%20Integrantes%20del%20Equipo/linkedin-black-icon-logo-ECC426C572-seeklogo.com_czkvxt.png"
                alt="logolinkedin"
              />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AboutCard;