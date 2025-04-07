import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface ZonaRiego {
  id: number;
  sector: string;
  nombre: string;
  tipo_riego: string;
  estado: string;
  latitud: number | null;
  longitud: number | null;
  motivo: string | null;
  fecha: string;
  color: string;
}

const IrrigationMap = ({ accessToken }: { accessToken: string }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [zonas, setZonas] = useState<ZonaRiego[]>([]);

  useEffect(() => {
    const fetchZonas = async () => {
      try {
        const response = await fetch("https://moriahmkt.com/iotapp/am/");
        const data = await response.json();
        setZonas(data.zonas);
      } catch (error) {
        console.error("Error al obtener zonas:", error);
      }
    };
    fetchZonas();
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || zonas.length === 0) return;

    mapboxgl.accessToken = accessToken;
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-86.84693143125786, 21.049120437418637], 
      zoom: 16,
    });

    zonas.forEach((zona) => {
      if (zona.latitud == null || zona.longitud == null) return;

      const popupContent = `
        <div style="padding: 10px; color: #333; max-width: 250px;">
          <h3 style="margin: 0 0 10px 0; color: ${zona.color}; border-bottom: 1px solid #eee; padding-bottom: 5px;">
            ${zona.nombre}
          </h3>
          <p style="margin: 5px 0;"><strong>Sector:</strong> ${zona.sector}</p>
          <p style="margin: 5px 0;"><strong>Tipo:</strong> ${zona.tipo_riego}</p>
          <p style="margin: 5px 0;">
            <strong>Estado:</strong> 
            <span style="color: ${
              zona.estado === 'encendido' ? '#4CAF50' : 
              zona.estado === 'apagado' ? '#9E9E9E' : 
              zona.estado === 'mantenimiento' ? '#FFC107' : '#F44336'
            }">
              ${zona.estado}
            </span>
          </p>
          ${zona.motivo ? `<p style="margin: 5px 0;"><strong>Motivo:</strong> ${zona.motivo}</p>` : ''}
          <p style="margin: 5px 0; font-size: 0.9em; color: #666;">
            <strong>Últ. actualización:</strong> ${new Date(zona.fecha).toLocaleString()}
          </p>
        </div>
      `;

      new mapboxgl.Marker({ color: zona.color })
        .setLngLat([zona.longitud, zona.latitud])
        .setPopup(new mapboxgl.Popup().setHTML(popupContent))
        .addTo(map);
    });

    mapRef.current = map;

    return () => {
      map.remove();
    };
  }, [zonas, accessToken]);

  return (
    <div style={{ height: "100vh" }}>
      <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default IrrigationMap;