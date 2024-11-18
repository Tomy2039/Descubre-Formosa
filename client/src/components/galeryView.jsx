import React from "react";
import VisitantGalery from "./visitantGalery";
import formosaLagunaOca from "../assets/Formosa_Laguna_Oca.png";


const GaleriaViews = () => {
  return (
    <div className="bg-yellow-50 min-h-screen">

      {/* Hero Section */}
      <section className="relative h-[60vh] bg-cover bg-center" style={{ backgroundImage: `url(${formosaLagunaOca})` }}>

        <div className="absolute inset-0 bg-yellow-900 bg-opacity-50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center text-center h-full text-yellow-50">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Arte Formoseño
          </h1>
          <p className="text-lg md:text-xl max-w-2xl">
            Una ventana al corazón cultural de Formosa a través de sus obras artísticas.
          </p>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-12">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[ 
            { title: "Arte Indígena", description: "Descubre las creaciones ancestrales de las comunidades originarias de Formosa." },
            { title: "Arte Contemporáneo", description: "Explora las expresiones modernas de artistas locales que representan nuestra cultura." },
            { title: "Esculturas Regionales", description: "Adéntrate en las piezas escultóricas que reflejan nuestra identidad formoseña." },
          ].map((item, idx) => (
            <div key={idx} className="bg-yellow-100 shadow-lg p-6 rounded-lg border border-yellow-300 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-bold mb-4 text-yellow-700">{item.title}</h3>
              <p className="text-gray-700">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Collection Section */}
      <VisitantGalery/>
    </div>
  );
};

export default GaleriaViews;