import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed flex flex-col"
      style={{
        backgroundImage: "url('/images/pergamino-textura.jpg')",
        backgroundColor: "#f8f3e7",
        fontFamily: "'EB Garamond', serif",
        color: "#3e2f1c",
      }}
    >
      {/* Capa translúcida para mejorar el contraste */}
      <div className="bg-[#fff9f0]/80 min-h-screen backdrop-blur-sm flex flex-col">
        {/* Navbar fijo */}
        <Navbar />
        
        {/* Contenido principal con margen superior para evitar que lo tape el navbar */}
        <main className="flex-grow container mx-auto p-6 pt-24">
          {children}
        </main>

        {/* Footer elegante */}
        <Footer />
      </div>
    </div>
  );
}
