import "./TrackerCard.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const TrackerCard = () => {
  return (
    <div className="tracker-card__container">
      <h1>Pomodoro Tracker</h1>
      <div className="tracker-card__circularProgress">
        <CircularProgressbar value={25} text={`${25}%`} strokeWidth={5} />
      </div>
      <button>Start Pomodoro</button>
      <button className="button-secondary button-disabled">Pause Pomodoro</button>
    </div>
  );
};

export default TrackerCard;
