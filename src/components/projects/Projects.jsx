import Data from "./Data";
import "./Projects.css";

import React from "react";

const Projects = () => {
  return (
    <section className="projects section" id="projects">
      <h2 className="section__title">My Projects</h2>
      <span className="section__subtitle">Recent Work</span>
      <div className="projects__container container grid">
        {Data.map(
          ({ id, color, icon, title, period, description, technologies, github, demo }) => {
            return (
              <div className="projects__card" key={id}>
                <div
                  className="projects__image"
                  role="img"
                  aria-label={title}
                  style={{
                    background: `linear-gradient(135deg, ${color[0]}, ${color[1]})`,
                  }}
                >
                  <i className={`${icon} projects__image-icon`}></i>
                </div>
                <div className="projects__content">
                  <h3 className="projects__title">{title}</h3>
                  <span className="projects__period">{period}</span>
                  <p className="projects__description">{description}</p>
                  <div className="projects__technologies">
                    {technologies.map((tech, index) => {
                      return (
                        <span className="projects__badge" key={index}>
                          {tech}
                        </span>
                      );
                    })}
                  </div>
                  <div className="projects__buttons">
                    {github !== "#" && (
                      <a
                        href={github}
                        className="projects__button"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <i className="uil uil-github"></i> GitHub
                      </a>
                    )}
                    {demo !== "#" && (
                      <a
                        href={demo}
                        className="projects__button"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <i className="uil uil-external-link-alt"></i> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          }
        )}
      </div>
    </section>
  );
};

export default Projects;
