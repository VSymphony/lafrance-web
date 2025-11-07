import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MainLayout from "../layouts/MainLayout";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Home() {
  const location = useLocation();
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (location.state?.mensaje) {
      setMensaje(location.state.mensaje);
      const timer = setTimeout(() => setMensaje(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const imagenes = [
    "/img/ratatouille-receta-plato-762435764.jpg",
    "/img/picture_5317-1936940617.jpg",
    "/img/ESCARGOT_SNAILS.jpg",
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <MainLayout>
      <div className="mt-6 space-y-10">
        {/* ✅ Mensaje animado */}
        <AnimatePresence>
          {mensaje && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="bg-green-100 text-green-700 px-4 py-2 rounded shadow mx-auto w-fit"
            >
              {mensaje}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ✅ Carrusel de imágenes */}
        <div className="max-w-4xl mx-auto rounded-lg overflow-hidden shadow-lg">
          <Slider {...sliderSettings}>
            {imagenes.map((src, i) => (
              <div key={i}>
                <img
                  src={src}
                  alt={`Slide ${i + 1}`}
                  className="w-full h-[400px] object-cover"
                />
              </div>
            ))}
          </Slider>
        </div>

        {/* ✅ Bienvenida */}
        <div className="text-center">
          <img src="/img/logo-lafrance.png" alt="Logo La France" className="h-24 mx-auto mb-4 drop-shadow-lg" />
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🍽️ Bienvenido a La France</h1>
          <p className="text-lg text-gray-600">El auténtico sabor francés en cada bocado.</p>
        </div>

        {/* ✅ Sección de especialidades */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
          {[
            { icon: "🥐", titulo: "Panadería Artesanal", desc: "Croissants, baguettes y más." },
            { icon: "🍷", titulo: "Vinos Selectos", desc: "Maridaje perfecto para cada plato." },
            { icon: "🍮", titulo: "Postres Franceses", desc: "Crème brûlée, macarons y delicias." },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-xl shadow p-6 text-center">
              <div className="text-4xl mb-2">{item.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800">{item.titulo}</h3>
              <p className="text-gray-600 mt-2">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* ✅ Llamado a la acción */}
        <div className="text-center mt-10">
          <a
            href="/reservas"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg text-lg shadow"
          >
            Reservar una mesa
          </a>
        </div>
      </div>
    </MainLayout>
  );
}