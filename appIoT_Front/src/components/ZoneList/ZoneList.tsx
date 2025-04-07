import { useEffect, useState } from "react";
import axios from "axios";
import "./ZoneList.css"

interface ZonaRiego {
    id: number;
    sector: string;
    nombre: string;
    tipo_riego: string;
    estado: string;
    motivo: string | null;
    fecha: string;
    color: string;
}

const ZoneList = () => {
    const [zonas, setZonas] = useState<ZonaRiego[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchZonas = async () => {
            try {
                const response = await axios.get("https://moriahmkt.com/iotapp/am/");
                const todasZonas: ZonaRiego[] = response.data.zonas;

                // Filtrar zonas con problemas
                const zonasConProblemas = todasZonas.filter(zona =>
                    ["mantenimiento", "descompuesto", "fuera_de_servicio"].includes(zona.estado)
                );

                setZonas(zonasConProblemas);
                setError(null);
            } catch (err) {
                console.error("Error al obtener zonas:", err);
                setError("No se pudieron cargar las zonas");
            } finally {
                setLoading(false);
            }
        };

        fetchZonas();
    }, []);

    if (loading) return <div className="loading">Cargando zonas...</div>;
    if (error) return <div className="error">{error}</div>;
    if (zonas.length === 0) return <div className="no-data">No hay zonas con problemas actualmente</div>;

    return (
        <div className="zonas-problemas-container">
            <h2 className="title">Zonas con problemas</h2>
            <div className="zonas-list">
                {zonas.map(zona => (
                    <div key={zona.id} className="zona-card" style={{ borderLeft: `4px solid ${zona.color}` }}>
                        <h3 className="zona-name">{zona.nombre}</h3>
                        <div className="zona-details">
                            <p><strong>Sector:</strong> {zona.sector}</p>
                            <p><strong>Tipo de riego:</strong> {zona.tipo_riego}</p>
                            <p>
                                <strong>Estado:</strong>
                                <span className={`status ${zona.estado.toLowerCase()}`}>
                                    {zona.estado}
                                </span>
                            </p>
                            {zona.motivo && <p><strong>Motivo:</strong> {zona.motivo}</p>}
                            <p><strong>Última actualización:</strong> {new Date(zona.fecha).toLocaleString()}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ZoneList;