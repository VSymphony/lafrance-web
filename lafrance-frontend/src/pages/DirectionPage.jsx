import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import L from "leaflet";

// ⚠️ Ajuste para ícono de marcador
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function DirectionPage() {
  const { saveDireccion } = useCart();
  const navigate = useNavigate();

  const [direccion, setDireccion] = useState("");
  const [referencia, setReferencia] = useState("");
  const [position, setPosition] = useState({ lat: -12.0464, lng: -77.0428 }); // Lima por defecto

  // Función para obtener dirección desde coordenadas
  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      if (data.display_name) {
        setDireccion(data.display_name);
      }
    } catch (err) {
      console.error("Error obteniendo la dirección:", err);
    }
  };

  // Componente para detectar clic en el mapa
  function ClickHandler() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition({ lat, lng });
        reverseGeocode(lat, lng); // actualizar dirección automáticamente
      },
      dragend() {
        // por si quieres arrastrar el mapa más adelante
      },
    });
    return null;
  }

  const handleGuardar = () => {
    if (!direccion) {
      alert("Debes ingresar la dirección");
      return;
    }
    saveDireccion({
      direccion,
      referencia,
      lat: position.lat,
      lng: position.lng,
    });
    navigate("/carrito"); // vuelve al carrito
  };

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">Selecciona tu dirección</h2>

      <input
        type="text"
        placeholder="Dirección"
        value={direccion}
        onChange={(e) => setDireccion(e.target.value)}
        className="border p-2 mb-2 w-full rounded"
      />
      <input
        type="text"
        placeholder="Referencia"
        value={referencia}
        onChange={(e) => setReferencia(e.target.value)}
        className="border p-2 mb-4 w-full rounded"
      />

      <MapContainer
        center={[position.lat, position.lng]}
        zoom={15}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler />
        <Marker
          position={[position.lat, position.lng]}
          draggable={true}
          eventHandlers={{
            dragend: (e) => {
              const marker = e.target;
              const { lat, lng } = marker.getLatLng();
              setPosition({ lat, lng });
              reverseGeocode(lat, lng); // actualizar dirección al mover el marcador
            },
          }}
        />
      </MapContainer>

      <button
        className="mt-4 bg-green-600 text-white py-2 px-4 rounded"
        onClick={handleGuardar}
      >
        Guardar Dirección
      </button>
    </div>
  );
}
