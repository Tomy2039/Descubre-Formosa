import { useState, useEffect } from "react";
import SongForm from "../components/songForm";

const CollaboratorSong = () => {
  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Obtener canciones del backend
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/song');
        const data = await response.json();
        if (Array.isArray(data)) {
          setSongs(data);
        } else {
          console.error("Se esperaba un arreglo de canciones, pero se recibió:", data);
        }
      } catch (error) {
        console.error('Error al obtener las canciones:', error);
      }
    };

    fetchSongs();
  }, []);

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedSong(null);
    setEditMode(false);
  };

  const handleAddSong = () => {
    setIsFormOpen(true);
    setEditMode(false);
    setSelectedSong(null);
  };

  const handleEditSong = (song) => {
    setSelectedSong(song);
    setEditMode(true);
    setIsFormOpen(true);
  };

  const handleDeleteSong = async (songId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/song/${songId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar la canción.");
      }

      setSongs((prevSongs) => prevSongs.filter((song) => song._id !== songId));
    } catch (error) {
      console.error("Error al eliminar la canción:", error);
    }
  };

  const handleSaveSong = (songData) => {
    if (editMode) {
      setSongs((prevSongs) =>
        prevSongs.map((song) => (song._id === songData._id ? songData : song))
      );
    } else {
      setSongs((prevSongs) => [...prevSongs, songData]);
    }
    handleCloseForm();
  };

  return (
    <div className="p-6 bg-yellow-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r bg-yellow-900 mb-8 shadow-lg">
          Mis Canciones
        </h1>
        <p className="text-center text-lg text-gray-800 mb-8 italic">
          Crea, edita y administra las canciones de tus artistas favoritos.
        </p>
        <div className="flex justify-center mb-6">
          <button
            onClick={handleAddSong}
            className="btn btn-warning px-6 py-3 text-white font-bold rounded-md shadow-xl hover:bg-yellow-900 transform transition duration-200 ease-in-out"
          >
            Agregar Canción
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mx-auto">
          {songs.map((song) => (
            <div
              key={song._id}
              className="card bg-yellow-200 p-4 rounded-lg shadow-md border-2 border-yellow-500 cursor-pointer transition-transform hover:scale-105"
            >
              {song.image && (
                <img
                  src={song.image}
                  alt={song.title}
                  className="w-full h-40 object-cover mb-4 rounded-md"
                />
              )}
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-700">{song.title}</h3>
                <h2 className="text-lg text-gray-700">{song.artist}</h2>
              </div>
              <div className="flex justify-center mt-4 space-x-4">
                <button
                  onClick={() => handleEditSong(song)}
                  className="btn btn-info text-lg text-yellow-200 hover:text-yellow-700 font-semibold"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteSong(song._id)}
                  className="btn btn-error text-lg text-yellow-200 hover:text-yellow-700 font-semibold"
                >
                  Eliminar
                </button>
                <button
                  onClick={() => setSelectedSong(song)}
                  className="btn btn-secondary text-lg text-yellow-200 hover:text-yellow-700 font-semibold"
                >
                  Ver Más
                </button>
              </div>
            </div>
          ))}
        </div>

        {isFormOpen && (
          <SongForm
            song={selectedSong}
            editMode={editMode}
            onSave={handleSaveSong}
            onClose={handleCloseForm}
          />
        )}

        {selectedSong && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="modal modal-open">
              <div className="modal-box bg-white p-6 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-semibold">{selectedSong.title}</h2>
                <h3 className="text-lg font-semibold mt-2">{selectedSong.artist}</h3>
                <p className="mt-4 text-lg">{selectedSong.description}</p>
                <p className="mt-4 text-lg">{selectedSong.category}</p>
                {selectedSong.image && (
                  <img
                    src={selectedSong.image}
                    alt={selectedSong.title}
                    className="w-full h-64 object-cover mt-4 mb-4 rounded-md"
                  />
                )}
                {selectedSong.audio && (
                  <audio
                    controls
                    src={selectedSong.audio}
                    className="w-full mt-4"
                  />
                )}
                <div className="flex justify-end space-x-4 mt-4">
                  <button
                    onClick={() => setSelectedSong(null)}
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

export default CollaboratorSong;
