import { useEffect, useRef } from 'react';
import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import "./ZoneChart.css"

// Registra los componentes necesarios de Chart.js
Chart.register(PieController, ArcElement, Tooltip, Legend);

interface ZonaRiego {
    estado: string;
}

const ZonesStatusChart = () => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart<'pie'> | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://moriahmkt.com/iotapp/am/');
                const zonas: ZonaRiego[] = response.data.zonas;

                // Contar zonas por estado
                const statusCount = zonas.reduce((acc, zona) => {
                    acc[zona.estado] = (acc[zona.estado] || 0) + 1;
                    return acc;
                }, {} as Record<string, number>);

                // Configurar datos para el gráfico
                const labels = Object.keys(statusCount);
                const data = Object.values(statusCount);
                const backgroundColors = labels.map(estado => {
                    switch (estado) {
                        case 'encendido': return '#4CAF50'; // Verde
                        case 'apagado': return '#9E9E9E';   // Gris
                        case 'mantenimiento': return '#FFC107'; // Amarillo
                        case 'descompuesto': return '#F44336';  // Rojo
                        case 'fuera_de_servicio': return '#607D8B'; // Azul grisáceo
                        default: return '#2196F3'; // Azul por defecto
                    }
                });

                if (chartRef.current) {
                    const ctx = chartRef.current.getContext('2d');
                    if (ctx) {
                        // Destruir instancia anterior si existe
                        if (chartInstance.current) {
                            chartInstance.current.destroy();
                        }

                        chartInstance.current = new Chart(ctx, {
                            type: 'pie',
                            data: {
                                labels,
                                datasets: [{
                                    data,
                                    backgroundColor: backgroundColors,
                                    borderWidth: 1
                                }]
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'right',
                                        labels: {
                                            boxWidth: 20,
                                            padding: 15,
                                            font: {
                                                size: 14
                                            }
                                        }
                                    },
                                    tooltip: {
                                        callbacks: {
                                            label: (context) => {
                                                const label = context.label || '';
                                                const value = context.raw || 0;
                                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                                const percentage = Math.round((Number(value) / total) * 100);
                                                return `${label}: ${value} (${percentage}%)`;
                                            }
                                        }
                                    }
                                }
                            }
                        });
                    }
                }
            } catch (error) {
                console.error('Error fetching zone data:', error);
            }
        };

        fetchData();

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, []);

    return (
        <div className="chart-container">
            <h3>Distribución de Zonas por Estado</h3>
            <div className="chart-wrapper-inner">
                <canvas ref={chartRef} />
            </div>
        </div>
    );
};

export default ZonesStatusChart;