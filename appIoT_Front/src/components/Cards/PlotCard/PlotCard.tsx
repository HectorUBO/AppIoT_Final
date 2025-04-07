import React from "react";
import "./PlotCard.css";

interface Plot {
    id: number;
    name: string;
    location: string;
    owner: string;
    plotType: string;
    lastWatered: string;
    deletedAt: string;
}

const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Fecha no disponible" : date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
};

const PlotCard: React.FC<{ plot: Plot }> = ({ plot }) => {
    return (
        <div className="plot-card">
            <h3>{plot.name}</h3>
            <p><strong>Ubicación:</strong> {plot.location}</p>
            <p><strong>Responsable:</strong> {plot.owner}</p>
            <p><strong>Tipo de cultivo:</strong> {plot.plotType}</p>
            <p><strong>Último riego:</strong> {formatDateTime(plot.lastWatered)}</p>
            <p><strong>Fecha de eliminación:</strong> {formatDateTime(plot.deletedAt)}</p>
        </div>
    );
};

export default PlotCard;