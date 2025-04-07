import axios from "axios";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import PlotCard from "../../components/Cards/PlotCard/PlotCard";
import "./DeletedPlots.css"

interface Plot {
    id: number;
    name: string;
    location: string;
    owner: string;
    plotType: string;
    lastWatered: string;
    deletedAt: string;
    isActive: boolean;
}

const DeletedPlots: React.FC = () => {
    const [plots, setPlots] = useState<Plot[]>([]);

    useEffect(() => {
        const fetchDeletedPlots = async () => {
            try {
                const response = await axios.get("http://localhost:3000/plots");
                const deletedPlots = response.data.filter((plot: Plot) => !plot.isActive);
                setPlots(deletedPlots);
            } catch (error) {
                console.error("Error al obtener las parcelas eliminadas:", error);
            }
        };

        fetchDeletedPlots();
    }, []);

    return (
        <div className="deleted-plots-container">
            <Header />
            <div className="main-content2">
                <Sidebar />
                <div className="plots-list">
                    <h2>Parcelas Eliminadas</h2>
                    {plots.length > 0 ? (
                        <div className="plots-grid">
                            {plots.map((plot) => <PlotCard key={plot.id} plot={plot} />)}
                        </div>
                    ) : (
                        <p className="no-plots-message">No hay parcelas eliminadas.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DeletedPlots;