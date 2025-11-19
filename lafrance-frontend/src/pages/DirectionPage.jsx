import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useCart } from "../context/CartContext";
import MainLayout from "../layouts/MainLayout";

function LocationMarker({ setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    }
  });
  return null;
}

export default function DirectionPage() {
  const [direccion, setDireccion] = useState("");
  const [referencia, setReferencia] = useState("");
  const [posicion, setPosicion] = useState(null);

  const { setDireccionCliente } = useCart();

  const guardarDireccion = async () => {
  try {
    const token = localStorage.getItem("token");

    const data = {
      direccion,
      referencia,
      lat: posicion?.lat || null,
      lng: posicion?.lng || null,
    };

    const response = await fetch("http://localhost:8070/api/pedidos/guardarDireccion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    // 🛑 Si el backend devuelve error (401/403/500)
    if (!response.ok) {
      const text = await response.text(); // evita JSON.parse error
      console.error("Error servidor:", text);
      alert("Error al guardar dirección: " + text);
      return;
    }

    // Ahora sí: parseamos JSON (porque es correcto)
    const result = await response.json();
    console.log("Dirección guardada:", result);

    // Guardar en Context
    setDireccionCliente(data);

    // Guardar en localStorage
    localStorage.setItem("direccionCliente", JSON.stringify(data));

    alert("Dirección guardada correctamente");

    window.location.href = "/carrito";

  } catch (error) {
    console.error("Error en petición:", error);
    alert("Ocurrió un error inesperado");
  }
};

  return (
    <MainLayout>
      <div className="container">
        <h1>Dirección de Entrega</h1>

        <label>Dirección completa</label>
        <input
          type="text"
          className="form-control"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
        />

        <label>Referencia (opcional)</label>
        <input
          type="text"
          className="form-control"
          value={referencia}
          onChange={(e) => setReferencia(e.target.value)}
        />

        <h3>Selecciona ubicación en el mapa</h3>
        <MapContainer
          center={[-12.0464, -77.0428]}
          zoom={13}
          style={{ height: "300px" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <LocationMarker setPosition={setPosicion} />

          {posicion && (
            <Marker position={posicion}></Marker>
          )}
        </MapContainer>

        <br />

        <button className="btn sello-btn" onClick={guardarDireccion}>
          Guardar Dirección
        </button>
      </div>
    </MainLayout>
  );
}
