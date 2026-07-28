import React, { memo } from "react";

const Info = memo(({setAnimationName}) => {
  return (
    <div
      className="about__info grid"
      onPointerOver={() => setAnimationName("clapping")}
      onPointerOut={() => setAnimationName("idle")}
    >
      <div className="about__box">
        <i class="bx bx-award about__icon"></i>

        <h3 className="about__title">Experience</h3>
        <span className="about__subtitle">3+ Years Experience</span>
      </div>
      <div className="about__box">
        <i class="bx bx-briefcase-alt about__icon"></i>

        <h3 className="about__title">Completed</h3>
        <span className="about__subtitle">30+ Projects</span>
      </div>
      <div className="about__box">
        <i class="bx bx-support about__icon"></i>

        <h3 className="about__title">Support</h3>
        <span className="about__subtitle">24/7 Support</span>
      </div>
    </div>
  );
});

export default Info;
