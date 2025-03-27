import { useReducer, useEffect, useRef } from "react";
import "./TrackerCard.css";
import "react-circular-progressbar/dist/styles.css";

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
      };
    default:
      return state;
  }
};

const TrackerCard = () => {
  const [state, dispatch] = useReducer(setTimerReducer, initialState);
  const intervalRef = useRef<number | null>(null);

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
    }
  }, [state.timeLeft]);

  const handleStart = () => {
    dispatch({ type: "START" });
  };

  const handleStop = () => {
    dispatch({ type: "PAUSE" });
  };

  const handleChange = () => {
    dispatch({type: "CHANGE"})
  };

  return (
    <div className="tracker-card__container">
      <h1>Pomodoro Tracker</h1>
      <div className="tracker-card__circularProgress">
        <div className="timer-text">
          {Math.floor(state.timeLeft / 60)}:
          {(state.timeLeft % 60).toString().padStart(2, "0")}
        </div>
      </div>
      {state.currentState === "running" ? (
        <button onClick={handleChange}>
          Start{" "}
          {state.currentMode === MODES.POMODORO ? MODES.BREAK : MODES.POMODORO}
        </button>
      ) : (
        <button onClick={handleStart}>Start {state.currentMode}</button>
      )}
      <button className="button-secondary" onClick={handleStop}>
        Pause {state.currentMode}
      </button>
    </div>
  );
};

export default TrackerCard;
