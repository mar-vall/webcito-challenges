export interface Mode {
  name: string;
  duration: number;
}

export const MODES: Record<"POMODORO" | "BREAK", Mode> = {
  POMODORO: { name: "Pomodoro", duration: 25 * 60 },
  BREAK: { name: "Break", duration: 5 * 60 },
};

export type STATES = "running" | "paused" | "finished" | "toStart";

export interface SessionState {
  timeLeft: number;
  currentMode: string;
  currentState: STATES;
  breaks: number;
  pomodoros: number;
}

export type TimeAction =
  | { type: "START" }
  | { type: "PAUSE" }
  | { type: "CHANGE" }
  | { type: "TICK" };

export const initialState: SessionState = {
  timeLeft: MODES.POMODORO.duration,
  currentMode: MODES.POMODORO.name,
  currentState: "toStart",
  breaks: 0,
  pomodoros: 0,
};
