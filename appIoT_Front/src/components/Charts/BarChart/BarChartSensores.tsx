import { useEffect, useRef } from "react";
import {
  Chart,
  BarController,
  BarElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  BarController,
  BarElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

interface HistoricalData {
  id: number;
  humidity: number;
  temperature: number;
  rain: number;
  sunIntensity: number;
  recordedAt: string;
}

interface BarChartSensoresProps {
  historicalData: HistoricalData[];
  metrics?: ("humidity" | "temperature" | "rain" | "sunIntensity")[];
  timeGrouping?: "hour" | "day" | "month"; // Nueva prop para agrupamiento temporal
}

export const BarChartSensores = ({
  historicalData,
  metrics = ["humidity", "temperature"],
  timeGrouping = "day", // Valor por defecto: agrupar por día
}: BarChartSensoresProps) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current && historicalData.length > 0) {
      // Ordenar datos por fecha
      const sortedData = [...historicalData].sort((a, b) => 
        new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime()
      );

      // Función para formatear la fecha según el agrupamiento
      const formatDate = (date: Date) => {
        switch (timeGrouping) {
          case "hour":
            return date.toLocaleTimeString([], { hour: '2-digit' }) + 'h';
          case "day":
            return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
          case "month":
            return date.toLocaleDateString([], { month: 'short', year: 'numeric' });
          default:
            return date.toLocaleDateString();
        }
      };

      // Agrupar datos por periodo de tiempo
      const groupedData: Record<string, HistoricalData[]> = {};
      sortedData.forEach(data => {
        const date = new Date(data.recordedAt);
        let key: string;
        
        switch (timeGrouping) {
          case "hour":
            key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`;
            break;
          case "day":
            key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
            break;
          case "month":
            key = `${date.getFullYear()}-${date.getMonth()}`;
            break;
          default:
            key = date.toISOString();
        }

        if (!groupedData[key]) {
          groupedData[key] = [];
        }
        groupedData[key].push(data);
      });

      // Calcular promedios por periodo
      const labels = Object.keys(groupedData).map(key => {
        const firstDate = new Date(groupedData[key][0].recordedAt);
        return formatDate(firstDate);
      });

      const datasets = metrics.map(metric => {
        // Configuración visual para cada métrica
        const visualConfig = {
          humidity: {
            label: "Humedad (%)",
            backgroundColor: "rgba(54, 162, 235, 0.7)",
            borderColor: "rgb(54, 162, 235)",
          },
          temperature: {
            label: "Temperatura (°C)",
            backgroundColor: "rgba(255, 99, 132, 0.7)",
            borderColor: "rgb(255, 99, 132)",
          },
          rain: {
            label: "Lluvia (mm)",
            backgroundColor: "rgba(75, 192, 192, 0.7)",
            borderColor: "rgb(75, 192, 192)",
          },
          sunIntensity: {
            label: "Intensidad Solar (%)",
            backgroundColor: "rgba(255, 206, 86, 0.7)",
            borderColor: "rgb(255, 206, 86)",
          },
        };

        return {
          ...visualConfig[metric],
          data: Object.values(groupedData).map(group => {
            // Calcular promedio del grupo
            const sum = group.reduce((acc, curr) => acc + curr[metric], 0);
            return sum / group.length;
          }),
          borderWidth: 1,
        };
      });

      const data = {
        labels,
        datasets,
      };

      const config = {
        type: "bar",
        data,
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: `Histórico de Sensores (Agrupado por día)`,
              font: { size: 16 },
            },
            legend: {
              position: "top",
            },
            tooltip: {
              callbacks: {
                label: function(context: any) {
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  label += context.parsed.y.toFixed(2);
                  return label;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Valor promedio",
              },
            },
            x: {
              title: {
                display: true,
                text: "Periodo de tiempo",
              },
            },
          },
        },
      };

      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        chartInstance.current = new Chart(ctx, config as any);
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [historicalData, metrics, timeGrouping]);

  return <canvas ref={chartRef} />;
};