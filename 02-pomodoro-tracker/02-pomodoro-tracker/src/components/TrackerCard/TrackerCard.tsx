import { useState, useCallback } from "react";
import "./TrackerCard.css";
import "react-circular-progressbar/dist/styles.css";
import CircleProgressBar from "../CircleProgressBar/CircleProgressBar";

const TrackerCard = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [workDuration] = useState(25 * 60); // 25 minutos en segundos
  const [breakDuration] = useState(5 * 60); // 5 minutos en segundos
  const [isWorkTime, setIsWorkTime] = useState(true);
  const [mode, setMode] = useState("Pomodoro");
  const [isFirstStart, setIsFirstStart] = useState(true);

  // Memoriza la función handleComplete usando useCallback
  const handleComplete = useCallback(() => {
    setIsWorkTime((prev) => !prev);
    setIsRunning(false);
    setMode((prevMode) => (prevMode === "Pomodoro" ? "Break" : "Pomodoro"));
  }, []); // No hay dependencias, por lo que la función no se redefine

  const startTimer = () => {
    if (isFirstStart) {
      setIsFirstStart(false);
    }

    // Cambiar de modo si el temporizador está en ejecución
    if (isRunning) {
      const newMode = mode === "Pomodoro" ? "Break" : "Pomodoro";
      setMode(newMode);
      setIsWorkTime(newMode === "Pomodoro");
    }

    // Iniciar o reiniciar el temporizador
    setIsRunning(true);
  };

  const handleChangeMode = (newMode: string) => {
    if (newMode === mode) return; // No hacer nada si el modo es el mismo

    // Cambiar el modo y reiniciar el temporizador
    setMode(newMode);
    setIsWorkTime(newMode === "Pomodoro");
    setIsRunning(false); // Detener el temporizador actual
  };

  return (
    <div className="tracker-card__container">
      <h1>Pomodoro Tracker</h1>
      <div className="tracker-card__circularProgress">
        <CircleProgressBar
          duration={isWorkTime ? workDuration : breakDuration}
          onComplete={handleComplete}
          isRunning={isRunning}
          mode={mode}
          onChangeMode={handleChangeMode}
        />
      </div>
      <button onClick={startTimer}>
        {isFirstStart
          ? "Start Pomodoro"
          : `Start ${mode === "Pomodoro" ? "Break" : "Pomodoro"}`}
      </button>
      <button
        className="button-secondary"
        onClick={() => setIsRunning(!isRunning)}
        disabled={isFirstStart} // Solo deshabilitado en la primera vez
      >
        {isRunning ? "Pause" : "Resume"}
      </button>
    </div>
  );
};

export default TrackerCard;