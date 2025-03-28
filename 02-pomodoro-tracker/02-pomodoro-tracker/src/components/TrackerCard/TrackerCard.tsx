import { useReducer, useEffect, useRef } from "react";
import "./TrackerCard.css";
import "react-circular-progressbar/dist/styles.css";
import { formatTime } from "./utils";
import CircleProgressBar from "../CircleProgressBar/CircleProgressBar";

const MODES = {
  POMODORO: "Pomodoro",
  BREAK: "Break",
};

const DURATIONS = {
  POMODORO: 25 * 60,
  BREAK: 5 * 60,
};

type STATES = "running" | "paused" | "finished" | "toStart";

type TimeAction =
  | { type: "START" }
  | { type: "PAUSE" }
  | { type: "CHANGE" }
  | { type: "TICK" };

interface SessionState {
  timeLeft: number;
  currentMode: string;
  currentState: STATES;
  breaks: number;
  pomodoros: number;
}

const initialState: SessionState = {
  timeLeft: DURATIONS.POMODORO,
  currentMode: MODES.POMODORO,
  currentState: "toStart",
  breaks: 0,
  pomodoros: 0,
};

const setTimerReducer = (
  state: SessionState,
  action: TimeAction
): SessionState => {
  switch (action.type) {
    case "START":
      return { ...state, currentState: "running" };
    case "PAUSE":
      return { ...state, currentState: "paused" };
    case "TICK":
      return { ...state, timeLeft: Math.max(0, state.timeLeft - 1) };
    case "CHANGE":
      const newMode =
        state.currentMode === MODES.POMODORO ? MODES.BREAK : MODES.POMODORO;
      const newTime =
        newMode === MODES.POMODORO ? DURATIONS.POMODORO : DURATIONS.BREAK;

      return {
        ...state,
        currentMode: newMode,
        timeLeft: newTime,
        currentState: "toStart",
        pomodoros: state.currentMode === MODES.POMODORO && state.timeLeft === 0 ? state.pomodoros + 1 : state.pomodoros,
        breaks: state.currentMode === MODES.BREAK && state.timeLeft === 0 ? state.breaks + 1 : state.breaks,
      };
    default:
      return state;
  }
};

const TrackerCard = () => {
  const [state, dispatch] = useReducer(setTimerReducer, initialState);
  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (state.currentState === "running") {
      intervalRef.current = setInterval(() => {
        dispatch({ type: "TICK" });
      }, 10);
    } else if (
      state.currentState === "paused" ||
      state.currentState === "toStart"
    ) {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state.currentState]);

  useEffect(() => {
    if (state.timeLeft === 0 && state.currentState === "running") {
      dispatch({ type: "CHANGE" });

      if (audioRef.current) {
        audioRef.current.play();
      }
      // Mostrar notificación
      showNotification(
        state.currentMode === "Pomodoro"
          ? "¡Pomodoro completado!"
          : "¡Descanso completado!",
        {
          body:
            state.currentMode === "Pomodoro"
              ? "Es hora de tomar un descanso."
              : "Es hora de volver al trabajo.",
          icon: "/vite.svg",
        }
      );
    }
  }, [state.timeLeft]);

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

  useEffect(() => {
    audioRef.current = new Audio("/bell-ringing-ii-98323.mp3");
  }, []);

  // Función para mostrar una notificación
  const showNotification = (title: string, options?: NotificationOptions) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, options);
    }
  };

  const handleStart = () => {
    dispatch({ type: "START" });
  };

  const handleStop = () => {
    if (state.currentState === "running") {
      dispatch({ type: "PAUSE" });
    } else {
      dispatch({ type: "START" });
    }
  };

  const handleChange = () => {
    dispatch({ type: "CHANGE" });
  };

  return (
    <div className="tracker-card__container">
      <h1>Pomodoro Tracker</h1>
      <div className="tracker-card__circularProgress">
        <CircleProgressBar
          duration={
            state.currentMode === MODES.POMODORO
              ? DURATIONS.POMODORO
              : DURATIONS.BREAK
          }
          timeLeft={state.timeLeft}
        />
        <div
          className="timer-text"
          style={
            state.currentMode === MODES.POMODORO
              ? { color: "#E046D7" }
              : { color: "#3AB499" }
          }
        >
          {formatTime(state.timeLeft)}
          <div className="timer-info">
            {state.currentMode === MODES.POMODORO
              ? `${state.pomodoros}x`
              : `${state.breaks}x`}
          </div>
        </div>
      </div>
      {state.currentState === "running" || state.currentState !== "toStart" ? (
        <button onClick={handleChange}>
          Start{" "}
          {state.currentMode === MODES.POMODORO ? MODES.BREAK : MODES.POMODORO}
        </button>
      ) : (
        <button onClick={handleStart}>Start {state.currentMode}</button>
      )}
      <button
        className={`button-secondary ${
          state.currentState === "toStart" ? "button-disabled" : ""
        }`}
        onClick={handleStop}
        disabled={state.currentState === "toStart"}
      >
        {state.currentState === "running" ? "Pause " : "Resume "}
        {state.currentMode}
      </button>
    </div>
  );
};

export default TrackerCard;
