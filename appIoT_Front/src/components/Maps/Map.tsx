import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import axios from "axios";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapProps {
  accessToken: string;
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

interface SensorData {
  temperature: number;
  humidity: number;
  rain: number;
  sunIntensity: number;
  recordedAt: string;
  plotId: number;
}

const MapComponent: React.FC<MapProps> = ({ accessToken }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [plots, setPlots] = useState<Plot[]>([]);
  const [sensorData, setSensorData] = useState<Record<number, SensorData>>({});

  useEffect(() => {
    const fetchPlots = async () => {
      try {
        const response = await axios.get("http://localhost:3000/plots");
        if (response.data && Array.isArray(response.data)) {
          const activePlots = response.data.filter((plot: Plot) => plot.isActive);
          setPlots(activePlots);
        } else {
          console.error("Estructura de datos inesperada:", response.data);
        }
      } catch (error) {
        console.error("Error al obtener los datos de la API:", error);
      }
    };

    const fetchSensorData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/plot-data");
        if (response.data && Array.isArray(response.data)) {
          const latestSensorData: Record<number, SensorData> = {};
          response.data.forEach((data: SensorData) => {
            if (!latestSensorData[data.plotId] || new Date(data.recordedAt) > new Date(latestSensorData[data.plotId].recordedAt)) {
              latestSensorData[data.plotId] = data;
            }
          });
          setSensorData(latestSensorData);
        } else {
          console.error("Estructura de datos inesperada en plot-data:", response.data);
        }
      } catch (error) {
        console.error("Error al obtener los datos de los sensores:", error);
      }
    };

    fetchPlots();
    fetchSensorData();
    const interval = setInterval(() => {
      fetchPlots();
      fetchSensorData();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = accessToken;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-86.86450856059658, 21.04299988321645],
      zoom: 12,
    });

    mapRef.current.on('load', () => {
      addMarkersToMap();
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [accessToken]);

  useEffect(() => {
    if (mapRef.current && plots.length > 0) {
      addMarkersToMap();
    }
  }, [plots, sensorData]);

  const addMarkersToMap = () => {
    if (!mapRef.current || plots.length === 0) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    plots.forEach((plot) => {
      if (isNaN(plot.latitude) || isNaN(plot.longitude)) return;

      const latestSensor = sensorData[plot.id];
      const popupContent = `
        <div style="padding: 10px; color: #333; max-width: 250px;">
          <h3 style="margin: 0 0 10px 0; color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 5px;">
            ${plot.name}
          </h3>
          <p style="margin: 5px 0;"><strong>📍 Ubicación:</strong> ${plot.location}</p>
          <p style="margin: 5px 0;"><strong>🧍 Responsable:</strong> ${plot.owner}</p>
          <p style="margin: 5px 0;"><strong>🌱 Tipo:</strong> ${plot.plotType}</p>
          <p style="margin: 5px 0;"><strong>💦 Último riego:</strong> ${formatDateTime(plot.lastWatered)}</p>
          
          ${latestSensor ? `
            <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #eee;">
              <h4 style="margin: 5px 0 10px 0; font-size: 14px;">Datos del sensor:</h4>
              <p style="margin: 5px 0;"><strong>🌡️ Temperatura:</strong> ${latestSensor.temperature}°C</p>
              <p style="margin: 5px 0;"><strong>💧 Humedad:</strong> ${latestSensor.humidity}%</p>
              <p style="margin: 5px 0;"><strong>🌧️ Lluvia:</strong> ${latestSensor.rain} mm</p>
              <p style="margin: 5px 0;"><strong>☀️ Intensidad solar:</strong> ${latestSensor.sunIntensity}%</p>
              <p style="margin: 5px 0; font-size: 0.9em; color: #666;">
                <strong>📅 Registrado:</strong> ${formatDateTime(latestSensor.recordedAt)}
              </p>
            </div>
          ` : '<p style="margin: 5px 0; color: #999;">Sin datos recientes del sensor</p>'}
        </div>
      `;

      const marker = new mapboxgl.Marker()
        .setLngLat([plot.longitude, plot.latitude])
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent))
        .addTo(mapRef.current!);

      markersRef.current.push(marker);
    });
  };

  const formatDateTime = (dateString: string): string => {
    return !isNaN(Date.parse(dateString))
      ? new Date(dateString).toLocaleString()
      : dateString;
  };

  return (
    <div
      ref={mapContainerRef}
      style={{ width: "100%", height: "100vh" }}
    />
  );
};

export default MapComponent;