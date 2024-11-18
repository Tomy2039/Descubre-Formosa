import { useState, useEffect } from "react";
import GaleryForm from "../components/galeryForm";

const CollaboratorGalery = () => {
  const [galeries, setGaleries] = useState([]);
  const [selectedGalery, setSelectedGalery] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Obtener eventos del backend
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

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedGalery(null);
    setEditMode(false);
  };

  const handleAddGalery = () => {
    setIsFormOpen(true);
    setEditMode(false);
    setSelectedGalery(null);
  };

  const handleEditGalery = (galery) => {
    setSelectedGalery(galery);
    setEditMode(true);
    setIsFormOpen(true);
  };

  const handleDeleteGalery = async (galeryId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/galery/${galeryId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar arte.");
      }

      setGaleries((prevGaleries) => prevGaleries.filter((galery) => galery._id !== galeryId));
    } catch (error) {
      console.error("Error al eliminar arte:", error);
    }
  };

  const handleSaveGalery = (galeryData) => {
    if (editMode) {
      setGaleries((prevGaleries) =>
        prevGaleries.map((galery) => (galery._id === galeryData._id ? galeryData : galery))
      );
    } else {
      setGaleries((prevGaleries) => [...prevGaleries, galeryData]);
    }
    handleCloseForm();
  };

  return (
    <div className="p-6 bg-yellow-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r bg-yellow-900 mb-8 shadow-lg">
          Mi galeria
        </h1>
        <p className="text-center text-lg text-gray-800 mb-8 italic">
          Crea, edita y administra los artes de tu comunidad.
        </p>
        <div className="flex justify-center mb-6">
          <button
            onClick={handleAddGalery}
            className="btn btn-warning px-6 py-3 text-white font-bold rounded-md shadow-xl hover:bg-yellow-900 transform transition duration-200 ease-in-out"
          >
            Agregar Arte
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mx-auto">
          {galeries.map((galery) => (
            <div
              key={galery._id}
              className="card bg-yellow-200 p-4 rounded-lg shadow-md border-2 border-yellow-500 cursor-pointer transition-transform hover:scale-105"
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
                  onClick={() => handleEditGalery(galery)}
                  className="btn btn-info text-lg text-yellow-200 hover:text-yellow-700 font-semibold"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteGalery(galery._id)}
                  className="btn btn-error text-lg text-yellow-200 hover:text-yellow-700 font-semibold"
                >
                  Eliminar
                </button>
                <button
                  onClick={() => setSelectedGalery(galery)}
                  className="btn btn-secondary text-lg text-yellow-200 hover:text-yellow-700 font-semibold"
                >
                  Ver Más
                </button>
              </div>
            </div>
          ))}
        </div>

        {isFormOpen && (
          <GaleryForm
            galery={selectedGalery}
            editMode={editMode}
            onSave={handleSaveGalery}
            onClose={handleCloseForm}
          />
        )}

        {/* Modal para ver más detalles del evento */}
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
                    onClick={() => setSelectedGalery(null)}
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

export default CollaboratorGalery;