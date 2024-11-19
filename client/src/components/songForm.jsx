import { useState, useEffect } from "react";

const SongForm = ({ song, editMode, onSave, onClose }) => {
  console.log(song); // Verifica si 'song' contiene los datos correctos

  // Inicializa formData de manera condicional dependiendo de si estamos editando una canción o no.
  const [formData, setFormData] = useState({
    id: song?.id || "",
    title: song?.title || "",
    artist: song?.artist || "",
    description: song?.description || "",
    category: song?.category || "",
    image: song?.image || null,
    audio: song?.audio || null,
  });

  const [imagePreview, setImagePreview] = useState(song?.image || null);
  const [audioPreview, setAudioPreview] = useState(song?.audio || null);
  const [loading, setLoading] = useState(false);

  const categories = ["Rock", "Hip-Hop", "Pop", "Electronica", "Jazz"];

  // Actualiza formData cuando 'song' cambia, asegurándose de que no se sobrescriba mientras se edita el formulario.
  useEffect(() => {
    if (editMode && song) {
      setFormData({
        id: song.id || "",
        title: song.title || "",
        artist: song.artist || "",
        description: song.description || "",
        category: song.category || "",
        image: song.image || null,
        audio: song.audio || null,
      });
      setImagePreview(song.image || null);
      setAudioPreview(song.audio || null);
    }
  }, [song, editMode]); // Solo actualiza cuando song o editMode cambian

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (name === "image") {
      setImagePreview(URL.createObjectURL(file));
    } else if (name === "audio") {
      setAudioPreview(URL.createObjectURL(file));
    }

    setFormData({ ...formData, [name]: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Canción en el formulario:", song); // Agregar depuración aquí

    // Validar si editMode y song._id están definidos
    if (editMode && (!song || !song._id)) {
        console.error("No se encontró la canción para editar o el ID es inválido.");
        setLoading(false);
        return;
    }

    const uploadToCloudinary = async (file, folder) => {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "DF_preset");
        data.append("folder", folder);

        try {
            const response = await fetch("https://api.cloudinary.com/v1_1/dtzgpdbyx/upload", {
                method: "POST",
                body: data,
            });

            const result = await response.json();
            return result.secure_url;
        } catch (error) {
            console.error(`Error al subir ${folder}:`, error);
            throw error;
        }
    };

    try {
        const uploadedImage = formData.image instanceof File
            ? await uploadToCloudinary(formData.image, "songs/images")
            : formData.image;

        const uploadedAudio = formData.audio instanceof File
            ? await uploadToCloudinary(formData.audio, "songs/audios")
            : formData.audio;

        const updatedSong = {
            ...formData,
            image: uploadedImage,  // URL obtenida de Cloudinary
            audio: uploadedAudio,  // URL obtenida de Cloudinary
        };

        const url = editMode
            ? `http://localhost:4000/api/song/${song._id}` // Para edición, usa el ID de la canción
            : "http://localhost:4000/api/song"; // Para creación, no hay ID

        const method = editMode ? "PUT" : "POST";

        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedSong),
        });

        if (!response.ok) {
            throw new Error("Error al guardar la canción.");
        }

        const savedSong = await response.json();
        onSave(savedSong);  // Llama a la función onSave con la canción guardada
    } catch (error) {
        console.error("Error al guardar la canción:", error);
    } finally {
        setLoading(false);
    }
};


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-xl max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {editMode ? "Editar Canción" : "Nueva Canción"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Título</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Artista</label>
            <input
              type="text"
              name="artist"
              value={formData.artist}
              onChange={handleInputChange}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Descripción</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="textarea textarea-bordered w-full"
              required
            ></textarea>
          </div>
          <div>
            <label className="block text-gray-700">Categoría</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="select select-bordered w-full"
              required
            >
              <option value="" disabled>
                Selecciona una categoría
              </option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Imagen</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input file-input-bordered w-full"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Vista previa"
                className="mt-2 w-full h-40 object-cover rounded-md"
              />
            )}
          </div>
          <div>
            <label className="block text-gray-700">Audio</label>
            <input
              type="file"
              name="audio"
              accept="audio/*"
              onChange={handleFileChange}
              className="file-input file-input-bordered w-full"
            />
            {audioPreview && (
              <audio controls src={audioPreview} className="mt-2 w-full"></audio>
            )}
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`btn btn-primary ${loading ? "loading" : ""}`}
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SongForm;
