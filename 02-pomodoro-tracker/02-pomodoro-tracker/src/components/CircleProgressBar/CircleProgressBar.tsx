import React, { useEffect, useRef, useState } from "react";
import "./CircleProgressBar.css";

interface CircleProgressBarProps {
  duration: number;
  onComplete: () => void;
  isRunning: boolean;
  mode: string;
  onChangeMode: (newMode: string) => void;
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
  mode,
  onChangeMode,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const circumference = 2 * Math.PI * 45; // Circunferencia del círculo (radio = 45)
  const timerRef = useRef<number | null>(null);

  // Reiniciar el tiempo cuando cambia la duración
  useEffect(() => {
    setTimeLeft(duration); // Reiniciar el tiempo restante
  }, [duration]);

  // Manejar el temporizador (iniciar/detener)
  useEffect(() => {
    if (isRunning) {
      // Iniciar el temporizador si está en ejecución
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 0) {
            clearInterval(timerRef.current!); // Detener el temporizador
            onComplete(); // Llamar a onComplete
            const nextMode = mode === "Pomodoro" ? "Break" : "Pomodoro";
            onChangeMode(nextMode); // Cambiar el modo en el padre
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Detener el temporizador si está pausado
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    // Limpiar el intervalo al desmontar el componente o cuando isRunning cambia
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, onComplete, mode, onChangeMode]);

  // Limpiar el intervalo al desmontar el componente
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

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
          stroke={mode === "Pomodoro" ? "#E046D7" : "#3AB499"}
          strokeWidth="5"
        />
        {/* Círculo de progreso */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="transparent"
          stroke={mode === "Pomodoro" ? "#E046D7" : "#3AB499"}
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="timer-text">{formatTime(timeLeft)}</div>
      <div className="timer-info">{isRunning ? "Session Running" : "Session Paused"}</div>
    </div>
  );
};

export default CircleProgressBar;