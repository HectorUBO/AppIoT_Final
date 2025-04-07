import { CategoryScale, Chart, Legend, LinearScale, LineController, LineElement, PointElement, Title, Tooltip } from "chart.js";
import { useEffect, useRef } from "react";

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

interface HistoricalData {
  id: number;
  humidity: number;
  temperature: number;
  rain: number;
  sunIntensity: number;
  recordedAt: string;
}

interface LineChartSensoresProps {
  historicalData: HistoricalData[];
  metrics?: string[]; // Opcional: para seleccionar qué métricas mostrar
}

export const LineChartSensores = ({ historicalData, metrics = ['temperature', 'humidity'] }: LineChartSensoresProps) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current && historicalData.length > 0) {
      // Ordenar datos por fecha
      const sortedData = [...historicalData].sort((a, b) => 
        new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime()
      );

      const labels = sortedData.map(data => 
        new Date(data.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );

      const datasetConfigs = [
        {
          key: 'temperature',
          label: "Temperatura (°C)",
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          yAxisID: "y1",
        },
        {
          key: 'humidity',
          label: "Humedad (%)",
          borderColor: "rgb(54, 162, 235)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          yAxisID: "y",
        },
        {
          key: 'rain',
          label: "Lluvia (mm)",
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          yAxisID: "y",
        },
        {
          key: 'sunIntensity',
          label: "Intensidad Solar (%)",
          borderColor: "rgb(255, 206, 86)",
          backgroundColor: "rgba(255, 206, 86, 0.2)",
          yAxisID: "y",
        }
      ];

      const datasets = datasetConfigs
        .filter(config => metrics.includes(config.key))
        .map(config => ({
          ...config,
          data: sortedData.map(data => data[config.key as keyof HistoricalData]),
          tension: 0.3,
        }));

      const data = {
        labels: labels,
        datasets: datasets,
      };

      const config = {
        type: "line",
        data: data,
        options: {
          responsive: true,
          interaction: {
            mode: "index",
            intersect: false,
          },
          plugins: {
            title: {
              display: true,
              text: "Histórico de Sensores",
              font: {
                size: 16,
              },
            },
            tooltip: {
              callbacks: {
                label: function (context: any) {
                  let label = context.dataset.label || "";
                  if (label) {
                    label += ": ";
                  }
                  label += context.parsed.y.toFixed(1);
                  return label;
                },
              },
            },
          },
          scales: {
            y: {
              type: "linear",
              display: true,
              position: "left",
              title: {
                display: true,
                text: "Humedad/Lluvia/Intensidad",
              },
            },
            y1: {
              type: "linear",
              display: true,
              position: "right",
              title: {
                display: true,
                text: "Temperatura (°C)",
              },
              grid: {
                drawOnChartArea: false,
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
  }, [historicalData, metrics]);

  return <canvas ref={chartRef} />;
};