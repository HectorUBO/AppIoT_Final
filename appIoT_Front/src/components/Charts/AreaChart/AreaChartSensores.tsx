import { useEffect, useRef } from "react";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface HistoricalData {
  id: number;
  humidity: number;
  temperature: number;
  rain: number;
  sunIntensity: number;
  recordedAt: string;
}

interface AreaChartSensoresProps {
  historicalData: HistoricalData[];
  metric: "humidity" | "temperature" | "rain" | "sunIntensity";
  timeFormat?: "hour" | "day" | "month" | "full";
}

export const AreaChartSensores = ({ 
  historicalData, 
  metric,
  timeFormat = "hour" 
}: AreaChartSensoresProps) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current && historicalData.length > 0) {
      // Ordenar datos por fecha
      const sortedData = [...historicalData].sort((a, b) => 
        new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime()
      );

      // Formatear las etiquetas de tiempo según el formato seleccionado
      const formatDate = (date: Date) => {
        switch (timeFormat) {
          case "hour":
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          case "day":
            return date.toLocaleDateString([], { weekday: 'short', day: 'numeric' });
          case "month":
            return date.toLocaleDateString([], { month: 'short', year: 'numeric' });
          case "full":
            return date.toLocaleString();
          default:
            return date.toLocaleTimeString();
        }
      };

      const labels = sortedData.map(data => formatDate(new Date(data.recordedAt)));
      const dataValues = sortedData.map(data => data[metric]);

      // Configuración visual para cada métrica
      const metricConfig = {
        humidity: {
          label: "Humedad (%)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgb(54, 162, 235)",
          unit: "%",
          beginAtZero: true
        },
        temperature: {
          label: "Temperatura (°C)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgb(255, 99, 132)",
          unit: "°C",
          beginAtZero: false
        },
        rain: {
          label: "Lluvia (mm)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgb(75, 192, 192)",
          unit: "mm",
          beginAtZero: true
        },
        sunIntensity: {
          label: "Intensidad Solar (%)",
          backgroundColor: "rgba(255, 206, 86, 0.2)",
          borderColor: "rgb(255, 206, 86)",
          unit: "%",
          beginAtZero: true
        }
      };

      const config = {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: metricConfig[metric].label,
              data: dataValues,
              fill: true,
              backgroundColor: metricConfig[metric].backgroundColor,
              borderColor: metricConfig[metric].borderColor,
              borderWidth: 2,
              tension: 0.4,
              pointRadius: 3,
              pointBackgroundColor: metricConfig[metric].borderColor,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: `Evolución temporal de ${metricConfig[metric].label}`,
              font: { size: 16 },
            },
            tooltip: {
              callbacks: {
                label: function(context: any) {
                  return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}${metricConfig[metric].unit}`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: metricConfig[metric].beginAtZero,
              title: {
                display: true,
                text: metricConfig[metric].unit,
              },
            },
            x: {
              title: {
                display: true,
                text: "Tiempo",
              },
              grid: {
                display: false,
              },
            },
          },
          interaction: {
            intersect: false,
            mode: 'index',
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
  }, [historicalData, metric, timeFormat]);

  return <canvas ref={chartRef} />;
};