import { FaFacebookF, FaInstagram, FaWhatsapp, FaTiktok } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="mt-10 text-white font-sans">
      <div className="grid grid-cols-1 md:grid-cols-3 text-center md:text-left">
        {/* Azul oscuro: Restaurante */}
        <div className="bg-[#0a1f44] bg-[url('/img/lino-textura.png')] bg-cover bg-blend-overlay px-6 py-8 flex items-center gap-4">
          <img
            src="/img/logo-lafrance.png"
            alt="Logo La France"
            className="h-15 drop-shadow-lg"
          />
          <div>
            <h3 className="text-xl font-serif font-semibold text-white mb-1">Restaurante La France</h3>
            <p className="text-sm text-blue-100 max-w-sm">
              El auténtico sabor francés en Lima. Tradición, elegancia y pasión en cada plato.
            </p>
          </div>
        </div>

        {/* Blanco suave: Contacto */}
        <div
          className="px-6 py-8 bg-gray-100 text-gray-800 bg-[url('/img/lino-textura.png')] bg-cover bg-blend-overlay"
        >
          <h3 className="text-xl font-semibold mb-2">Contacto</h3>
          <p className="text-sm">📍 Av. Gourmet 123, Santiago de Surco</p>
          <p className="text-sm">📞 +51 987 654 321</p>
          <p className="text-sm">✉️ reservas@lafrance.pe</p>
        </div>

        {/* Rojo borgoña: Redes sociales */}
        <div
          className="px-6 py-8 bg-[#7b1e1e] bg-[url('/img/lino-textura.png')] bg-cover bg-blend-overlay"
        >
          <h3 className="text-xl font-semibold mb-2">Síguenos</h3>
          <div className="flex justify-center md:justify-start gap-4 mt-2 text-xl">
            {[
              { icon: <FaFacebookF />, link: "https://facebook.com" },
              { icon: <FaInstagram />, link: "https://instagram.com" },
              { icon: <FaWhatsapp />, link: "https://wa.me/51987654321" },
              { icon: <FaTiktok />, link: "https://tiktok.com" },
            ].map((item, i) => (
              <a
                key={i}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform duration-300 hover:text-white"
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Línea inferior */}
      <div className="bg-gray-900 text-center py-4 text-sm text-gray-400">
        © 2025 Restaurante La France S.A.C. | Todos los derechos reservados.
      </div>
    </footer>
  );
}