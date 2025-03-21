import React, { useEffect, useRef, useState } from "react";
import "./CircleProgressBar.css";

interface CircleProgressBarProps {
  duration: number;
  onComplete: () => void;
  isRunning: boolean;
  color: string;
  mode: string;
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

const CircleProgressBar: React.FC<CircleProgressBarProps> = ({
  duration,
  onComplete,
  isRunning,
  color,
  mode,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const circumference = 2 * Math.PI * 45; // Circunferencia del círculo (radio = 45)
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [breakCounter, setBreakCounter] = useState<number>(-1);
  const [pomodoroCounter, setPomodoroCounter] = useState<number>(-2);

  // Función para mostrar una notificación
  const showNotification = (title: string, options?: NotificationOptions) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, options);
    }
  };

  useEffect(() => {
    audioRef.current = new Audio("/bell-ringing-ii-98323.mp3");
  }, []);

  // Reiniciar el tiempo cuando cambia la duración
  useEffect(() => {
    setTimeLeft(duration);
  }, [duration, mode]);

  useEffect(() => {
    if (mode === "Pomodoro") {
      setPomodoroCounter((prev) => prev + 1);
    } else {
      setBreakCounter((prev) => prev + 1);
    }
  }, [mode]);

  // Manejar el temporizador (iniciar/detener)
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 0) {
            clearInterval(timerRef.current!);
            onComplete(); // Dejar que el padre maneje el cambio de modo

            if (audioRef.current) {
              audioRef.current.play();
            }

            // Mostrar notificación
            showNotification(
              mode === "Pomodoro"
                ? "¡Pomodoro completado!"
                : "¡Descanso completado!",
              {
                body:
                  mode === "Pomodoro"
                    ? "Es hora de tomar un descanso."
                    : "Es hora de volver al trabajo.",
                icon: "/vite.svg",
              }
            );

            return duration; // Reiniciar el tiempo
          }
          return prev - 1;
        });
      }, 100);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, onComplete, duration]);

  const strokeDashoffset = ((duration - timeLeft) / duration) * circumference;

  return (
    <div className="progress-bar">
      <svg width="244" height="244" viewBox="0 0 100 100">
        {/* Círculo base (fondo) */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="transparent"
          strokeOpacity="0.2"
          stroke={color}
          strokeWidth="5"
        />
        {/* Círculo de progreso */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="transparent"
          stroke={color}
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="timer-text" style={{ color }}>
        {formatTime(timeLeft)}
      </div>
      <div className="timer-info" style={{ color }}>
        {isRunning
          ? mode === "Pomodoro"
            ? `${pomodoroCounter}x`
            : `${breakCounter}x`
          : "Session Paused"}
      </div>
    </div>
  );
};

export default CircleProgressBar;
