import { useState, useCallback } from "react";
import "./TrackerCard.css";
import "react-circular-progressbar/dist/styles.css";
import CircleProgressBar from "../CircleProgressBar/CircleProgressBar";

const TrackerCard = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [workDuration] = useState(25 * 60); // 25 minutos en segundos
  const [breakDuration] = useState(5 * 60); // 5 minutos en segundos
  const [isWorkTime, setIsWorkTime] = useState(true);

  // Memoriza la función handleComplete usando useCallback
  const handleComplete = useCallback(() => {
    setIsWorkTime((prev) => !prev);
    setIsRunning(false);
  }, []); // No hay dependencias, por lo que la función no se redefine

  return (
    <div className="tracker-card__container">
      <h1>Pomodoro Tracker</h1>
      <div className="tracker-card__circularProgress">
        <CircleProgressBar
          duration={isWorkTime ? workDuration : breakDuration}
          onComplete={handleComplete}
          isRunning={isRunning}
        />
      </div>
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? "Pause" : "Start"}
      </button>
      <button className="button-secondary">Pause Pomodoro</button>
    </div>
  );
};

export default TrackerCard;