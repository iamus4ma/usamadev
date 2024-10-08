import "./Qualification.css";

import React, { useState } from "react";

const Qualification = () => {
  const [toggleState, setToggleState] = useState(1);

  const toggleTab = (index) => {
    setToggleState(index);
  };
  return (
    <section className="qualification section">
      <h2 className="section__title">Qualification</h2>
      <span className="section__subtitle">My personnel journey</span>

      <div className="qualification__container container">
        <div className="qualification__tabs">
          <div
            className={
              toggleState === 1
                ? "qualification__button qualification__active button--flex"
                : "qualification__button button--flex"
            }
            onClick={() => toggleTab(1)}
          >
            <i className="uil uil-graduation-cap qualification__icon"></i>
            Education
          </div>

          <div
            className={
              toggleState === 2
                ? "qualification__button qualification__active button--flex"
                : "qualification__button button--flex"
            }
            onClick={() => toggleTab(2)}
          >
            <i className="uil uil-briefcase-alt qualification__icon"></i>
            Experience
          </div>
        </div>

        <div className="qualification__sections">
          <div
            className={
              toggleState === 1
                ? "qualification__content qualification__content-active"
                : "qualification__content"
            }
          >
            <div className="qualification__data">
              <div>
                <h3 className="qualification__title">Software Engineering</h3>
                <span className="qualification__subtitle">
                  COMSATS - University
                </span>
                <div className="qualification__calender">
                  <i className="uil uil-calendar-alt"></i>
                  2019 - 2023
                </div>
              </div>

              <div>
                <span className="qualification__rounder"></span>
                <span className="qualification__line"></span>
              </div>
            </div>
            <div className="qualification__data">
              <div></div>

              <div>
                <span className="qualification__rounder"></span>
                <span className="qualification__line"></span>
              </div>
              <div>
                <h3 className="qualification__title">Intermediate</h3>
                <span className="qualification__subtitle">
                  Superior - College
                </span>
                <div className="qualification__calender">
                  <i className="uil uil-calendar-alt"></i>
                  2016 - 2018
                </div>
              </div>
            </div>

            <div className="qualification__data">
              <div>
                <h3 className="qualification__title">Matric</h3>
                <span className="qualification__subtitle">
                  Govt School - School
                </span>
                <div className="qualification__calender">
                  <i className="uil uil-calendar-alt"></i>
                  2015
                </div>
              </div>

              <div>
                <span className="qualification__rounder"></span>
                <span className="qualification__line"></span>
              </div>
            </div>

            {/* <div className="qualification__data">
              <div></div>

              <div>
                <span className="qualification__rounder"></span>
                <span className="qualification__line"></span>
              </div>
              <div>
                <h3 className="qualification__title">Ielts</h3>
                <span className="qualification__subtitle">
                  British Council - Institute
                </span>
                <div className="qualification__calender">
                  <i className="uil uil-calendar-alt"></i>
                  2018
                </div>
              </div>
            </div> */}
          </div>

          <div className={
              toggleState === 2
                ? "qualification__content qualification__content-active"
                : "qualification__content"
            }>
            <div className="qualification__data">
              <div>
                <h3 className="qualification__title">React Developer</h3>
                <span className="qualification__subtitle">
                  SimplexMed
                </span>
                <div className="qualification__calender">
                  <i className="uil uil-calendar-alt"></i>
                  2023 - Present
                </div>
              </div>

              <div>
                <span className="qualification__rounder"></span>
                <span className="qualification__line"></span>
              </div>
            </div>

            <div className="qualification__data">
              <div></div>

              <div>
                <span className="qualification__rounder"></span>
                <span className="qualification__line"></span>
              </div>
              <div>
                <h3 className="qualification__title">Ui/Ux Designer</h3>
                <span className="qualification__subtitle">
                Freelancing - Online
                </span>
                <div className="qualification__calender">
                  <i className="uil uil-calendar-alt"></i>
                  2020 - present
                </div>
              </div>
            </div>

            <div className="qualification__data">
              <div>
                <h3 className="qualification__title">Web Development</h3>
                <span className="qualification__subtitle">
                  CUI Sahiwal - Software-House
                </span>
                <div className="qualification__calender">
                  <i className="uil uil-calendar-alt"></i>
                  2022 - 2023
                </div>
              </div>

              <div>
                <span className="qualification__rounder"></span>
                <span className="qualification__line"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Qualification;
