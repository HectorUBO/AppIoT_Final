import { JSX } from "react";
import "./SensorCard.css";

interface CardProps {
  title: string;
  value: string;
  icon?: JSX.Element;
  className?: string;
}

export const SensorCard = ({ title, value, icon, className }: CardProps) => {
  return (
    <div className={`card ${className}`}>
      <div className="card-header">
        {icon && <div className="card-icon">{icon}</div>}
        <span className="card-title">{title}</span>
      </div>
      <div className="card-value">{value}</div>
    </div>
  );
};
