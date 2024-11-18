import { useState, useEffect } from "react";

const VisitantGalery = () => {
  const [galeries, setGaleries] = useState([]);
  const [selectedGalery, setSelectedGalery] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Estado para el campo de búsqueda

  // Obtener galerías del backend
  useEffect(() => {
    const fetchGaleries = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/galery');
        const data = await response.json();
        if (Array.isArray(data)) {
          setGaleries(data);
        } else {
          console.error("Expected an array of galeries, but got:", data);
        }
      } catch (error) {
        console.error('Error fetching galeries:', error);
      }
    };

    fetchGaleries();
  }, []);

  // Función para manejar el cambio en el campo de búsqueda
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filtrar galerías en función del nombre o autor
  const filteredGaleries = galeries.filter(
    (galery) =>
      galery.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      galery.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Función para seleccionar una galería
  const handleViewMore = (galery) => {
    setSelectedGalery(galery);
  };

  // Función para cerrar el modal de detalles
  const handleCloseModal = () => {
    setSelectedGalery(null);
  };

  return (
    <div className="p-6 bg-yellow-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r bg-yellow-900 mb-8 shadow-lg">
          Coleccion de Arte Formoseño
        </h1>
        {/* Buscador */}
        <div className="flex justify-center mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Buscar por nombre o autor..."
            className="input input-bordered input-warning w-full max-w-xs "
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mx-auto">
          {filteredGaleries.map((galery) => (
            <div
              key={galery._id}
              className="input-warning card p-4 rounded-lg shadow-md border-2 bg-yellow-100 cursor-pointer transition-transform hover:scale-105"
            >
              {galery.image && (
                <img
                  src={galery.image}
                  alt={galery.name}
                  className="w-full h-40 object-cover mb-4 rounded-md"
                />
              )}
              <h3 className="text-xl font-bold text-gray-700 text-center">{galery.name}</h3>
              <h2 className="text-lg text-gray-700 text-center">{galery.author}</h2>
              <div className="flex justify-center mt-2 space-x-4">
                <button
                  onClick={() => handleViewMore(galery)}
                  className="btn btn-warning text-lg text-yellow-700 hover:text-yellow-100 font-semibold"
                >
                  Ver Más
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal para ver más detalles de la galería */}
        {selectedGalery && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="modal modal-open">
              <div className="modal-box bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold">{selectedGalery.name}</h2>
                <h3 className="text-lg font-semibold mt-2">{selectedGalery.author}</h3>
                <p className="mt-4 text-lg">{selectedGalery.description}</p>
                {selectedGalery.image && (
                  <img
                    src={selectedGalery.image}
                    alt={selectedGalery.name}
                    className="w-full h-64 object-cover mt-4 mb-4 rounded-md"
                  />
                )}
                <div className="flex justify-end space-x-4 mt-4">
                  <button
                    onClick={handleCloseModal}
                    className="btn btn-warning text-white hover:text-yellow-700"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisitantGalery;
