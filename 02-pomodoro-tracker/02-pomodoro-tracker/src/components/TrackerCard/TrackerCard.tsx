import { useState, useCallback } from "react";
import "./TrackerCard.css";
import "react-circular-progressbar/dist/styles.css";
import CircleProgressBar from "../CircleProgressBar/CircleProgressBar";

const MODES = {
  POMODORO: "Pomodoro",
  BREAK: "Break",
};

const DURATIONS = {
  POMODORO: 25 * 60,
  BREAK: 5 * 60,
};

const TrackerCard = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState(MODES.POMODORO);
  const [isFirstStart, setIsFirstStart] = useState(true);

  // Función para cambiar entre modos
  const toggleMode = useCallback(() => {
    setMode((prevMode) =>
      prevMode === MODES.POMODORO ? MODES.BREAK : MODES.POMODORO
    );
  }, []);

  // Función para manejar la finalización del temporizador
  const handleComplete = useCallback(() => {
    toggleMode();
    setIsRunning(false);
  }, [toggleMode]);

  // Función para iniciar o cambiar el modo del temporizador
  const handleStartOrToggleMode = () => {
    if (isFirstStart) {
      setIsFirstStart(false);
    } else {
      toggleMode();
    }
    setIsRunning(true);
  };

  // Función para cambiar el modo manualmente
  const handleChangeMode = (newMode: string) => {
    if (newMode === mode) return; // No hacer nada si el modo es el mismo
    setMode(newMode);
    setIsRunning(false); // Detener el temporizador actual
  };

  // Determinar la duración actual basada en el modo
  const currentDuration = mode === MODES.POMODORO ? DURATIONS.POMODORO : DURATIONS.BREAK;

  return (
    <div className="tracker-card__container">
      <h1>Pomodoro Tracker</h1>
      <div className="tracker-card__circularProgress">
        <CircleProgressBar
          duration={currentDuration}
          onComplete={handleComplete}
          isRunning={isRunning}
          mode={mode}
          onChangeMode={handleChangeMode}
        />
      </div>
      <button onClick={handleStartOrToggleMode}>
        {isFirstStart
          ? `Start ${MODES.POMODORO}`
          : `Start ${mode === MODES.POMODORO ? MODES.BREAK : MODES.POMODORO}`}
      </button>
      <button
        className="button-secondary"
        onClick={() => setIsRunning(!isRunning)}
        disabled={isFirstStart}
      >
        {isRunning ? `Pause ${mode}` : `Resume ${mode}`}
      </button>
    </div>
  );
};

export default TrackerCard;