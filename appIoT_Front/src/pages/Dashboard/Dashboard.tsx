import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import MapComponent from "../../components/Maps/Map";
import api from "../../services/api";
import { FaSpinner } from "react-icons/fa";
import "./Dashboard.css";
import { LineChartSensores } from "../../components/Charts/LineChart/LineChartSensores";
import { BarChartSensores } from "../../components/Charts/BarChart/BarChartSensores";
import { AreaChartSensores } from "../../components/Charts/AreaChart/AreaChartSensores";
import { SensorCard } from "../../components/Cards/SensorCard/SensorCard";
import { WbSunny, Cloud, CloudQueue, Grain, AcUnit, Thermostat } from "@mui/icons-material";

function Dashboard() {
  const [plots, setPlots] = useState<Plot[]>([]);
  const [plotData, setPlotData] = useState<PlotData[]>([]);

  interface ExternalData {
    id: number;
    humidity: number;
    temperature: number;
    rain: number;
    sunIntensity: number;
    recordedAt: string;
  }

  interface HistoricalSensorData {
    id: number;
    humidity: number;
    temperature: number;
    rain: number;
    sunIntensity: number;
    recordedAt: string;
  }

  interface Plot {
    id: number;
    name: string;
    location: string;
    owner: string;
    plotType: string;
    lastWatered: string;
    latitude: number;
    longitude: number;
    isActive: boolean;
  }

  interface PlotData {
    plotId: any;
    id: number;
    temperature?: number;
    humidity?: number;
    rain?: number;
    sunIntensity?: number;
    recordedAt: string;
  }

  const [historicalData, setHistoricalData] = useState<HistoricalSensorData[]>([]);
  const [externalData, setExternalData] = useState<ExternalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [latestData, setLatestData] = useState<Record<number, PlotData>>({});
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const fetchLocalData = async () => {
      try {
        const [plotsResponse, dataResponse, historyResponse] = await Promise.all([
          api.get("/plots"),
          api.get("/plot-data"),
          api.get("/sensor-data/history?limit=10")
        ]);

        setPlots(plotsResponse.data);
        setPlotData(dataResponse.data);
        setHistoricalData(historyResponse.data);

        const latest: Record<number, PlotData> = {};
        dataResponse.data.forEach((data: PlotData) => {
          if (!latest[data.plotId] || new Date(data.recordedAt) > new Date(latest[data.plotId].recordedAt)) {
            latest[data.plotId] = data;
          }
        });
        setLatestData(latest);
      } catch (err: any) {
        console.error("Error al obtener datos locales", err);
        setError("Error al cargar datos locales");
      }
    };

    const fetchExternalData = async () => {
      try {
        const response = await api.get('/sensor-data/latest');
        setExternalData(response.data);
      } catch (err) {
        console.error("Error al obtener datos de sensores", err);
        setExternalData(null);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        await fetchLocalData();

        if (isOnline) {
          await fetchExternalData();
        }
      } catch (err: any) {
        console.error("Error general al obtener datos", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [isOnline]);

  if (loading) return (
    <div className="loading-container">
      <FaSpinner className="spinner" />
    </div>
  );

  if (error) return <div className="error">Error: {error}</div>;

  const enrichedPlots = plots.map(plot => ({
    ...plot,
    sensor: latestData[plot.id]
      ? {
        temperature: latestData[plot.id].temperature || 0,
        humidity: latestData[plot.id].humidity || 0,
        rain: latestData[plot.id].rain || 0,
        sunIntensity: latestData[plot.id].sunIntensity || 0,
      }
      : { temperature: 0, humidity: 0, rain: 0, sunIntensity: 0 },
  }));

  const getSensorIcon = (title: string, value: number) => {
    switch (title) {
      case "Temperatura":
        if (value < 10) return <AcUnit fontSize="large" />;
        if (value > 25) return <Thermostat fontSize="large" />;
        return <WbSunny fontSize="large" />;

      case "Humedad":
        return value < 30 ? <CloudQueue fontSize="large" /> : <Cloud fontSize="large" />;

      case "Lluvia":
        if (value === 0) return <WbSunny fontSize="large" />;
        if (value <= 5) return <CloudQueue fontSize="large" />;
        return <Grain fontSize="large" />;

      case "Intensidad del Sol":
        return value > 70 ? <WbSunny fontSize="large" /> : <CloudQueue fontSize="large" />;

      default:
        return undefined;
    }
  };

  const activePlots = enrichedPlots.filter(plot => plot.isActive === true);

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header />

        <div className="top-section">
          <div className="map-container">
            <MapComponent
              accessToken="pk.eyJ1IjoiaGVjdG9yYmFvIiwiYSI6ImNtNGRjbzZhcTBobm4ya3B5cGg0bHNmMTcifQ.PQ3zQrL4FlfNZdiSX7bMnA"
            />
          </div>

          <div className="cards-container">
            <SensorCard
              title="Temperatura"
              value={externalData ? `${externalData.temperature}°C` : "Datos no disponibles"}
              icon={externalData ? getSensorIcon("Temperatura", externalData.temperature) : undefined}
            />
            <SensorCard
              title="Humedad"
              value={externalData ? `${externalData.humidity}%` : "Datos no disponibles"}
              icon={externalData ? getSensorIcon("Humedad", externalData.humidity) : undefined}
            />
            <SensorCard
              title="Lluvia"
              value={externalData ? `${externalData.rain} mm` : "Datos no disponibles"}
              icon={externalData ? getSensorIcon("Lluvia", externalData.rain) : undefined}
            />
            <SensorCard
              title="Intensidad del Sol"
              value={externalData ? `${externalData.sunIntensity}%` : "Datos no disponibles"}
              icon={externalData ? getSensorIcon("Intensidad del Sol", externalData.sunIntensity) : undefined}
            />
          </div>

        </div>

        <div className="charts-container">
          <div className="chart-card">
            <LineChartSensores
              historicalData={historicalData}
              metrics={['temperature', 'humidity']}
            />
          </div>

          <div className="chart-card">
            <BarChartSensores
              historicalData={historicalData}
              metrics={['rain', 'sunIntensity']}
            />
          </div>

          <div className="chart-card">
            <AreaChartSensores
              historicalData={historicalData}
              metric="temperature"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;