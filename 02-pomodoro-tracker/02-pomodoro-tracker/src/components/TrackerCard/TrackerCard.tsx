import React from "react";
import './TrackerCard.css'

const TrackerCard = () => {
  return (
    <div className="tracker-card__container">
      <h1>Pomodoro Tracker</h1>
        <button>Pause Pomodoro</button>
        <button>Start Pomodoro</button>
    </div>
  );
};

export default TrackerCard;
