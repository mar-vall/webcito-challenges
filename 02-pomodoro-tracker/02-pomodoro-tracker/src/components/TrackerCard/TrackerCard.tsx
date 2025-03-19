import { useState, useCallback, useEffect } from "react";
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
    setMode((prevMode) =>
      prevMode === MODES.POMODORO ? MODES.BREAK : MODES.POMODORO
    );
    setIsRunning(false);
  }, []);
  

  // Función para iniciar o cambiar el modo del temporizador
  const handleStartOrToggleMode = () => {
    if (isFirstStart) {
      setIsFirstStart(false);
    } else {
      toggleMode();
    }
    setIsRunning(true);
  };

  // Solicitar permiso para notificaciones al cargar el componente
  useEffect(() => {
    const requestNotificationPermission = async () => {
      if ("Notification" in window) {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          console.log("Permiso para notificaciones concedido.");
        } else {
          console.log("Permiso para notificaciones denegado.");
        }
      } else {
        console.log("Este navegador no soporta notificaciones.");
      }
    };
    requestNotificationPermission();
  }, []);

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
          color={mode === MODES.POMODORO ? "#E046D7" : "#3AB499"}
          mode={mode}
        />
      </div>
      <button onClick={handleStartOrToggleMode}>
        {isFirstStart
          ? `Start ${MODES.POMODORO}`
          : `Start ${mode === MODES.POMODORO ? MODES.BREAK : MODES.POMODORO}`}
      </button>
      <button
        className={`button-secondary ${isFirstStart ? "button-disabled" : ""}`}
        onClick={() => setIsRunning(!isRunning)}
        disabled={isFirstStart}
      >
        {isRunning ? `Pause ${mode}` : `Resume ${mode}`}
      </button>
    </div>
  );
};

export default TrackerCard;