import React from "react";
import "./CircleProgressBar.css";

interface CircleProgressBarProps {
  duration: number;
  timeLeft: number;
}

const CircleProgressBar: React.FC<CircleProgressBarProps> = ({
  duration,
  timeLeft,
}) => {
  const circumference = 2 * Math.PI * 45; // Circunferencia del círculo (radio = 45) 

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
          stroke={duration === 1500 ? "#E046D7" : "#3AB499"}
          strokeWidth="5"
        />
        {/* Círculo de progreso */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="transparent"
          stroke={duration === 1500 ? "#E046D7" : "#3AB499"}
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
      </svg>

    </div>
  );
};

export default CircleProgressBar;
