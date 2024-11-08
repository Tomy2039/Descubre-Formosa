import { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

const MarkerForm = ({
  formData,
  setFormData,
  editMode,
  setMarkers,
  markers,
  currentMarkerIndex,
  handleCloseForm,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [imageFile, setImageFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar la animación
  const imageInputRef = useRef(null);
  const audioInputRef = useRef(null);

  useEffect(() => {
    setIsOpen(true); // Cuando el componente se monta, activamos la animación de apertura
  }, []);

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMediaChange = (e) => {
    const { files, name } = e.target;
    if (name === "image") setImageFile(files[0]);
    if (name === "audio") setAudioFile(files[0]);
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'my_preset'); // Asegúrate de tener un preset configurado

    try {
        const res = await fetch('https://api.cloudinary.com/v1_1/dkktczf96/upload', {
            method: 'POST',
            body: formData,
        });

        // Verifica si la respuesta es exitosa
        if (!res.ok) {
            throw new Error(`Error en la respuesta: ${res.statusText}`);
        }

        const data = await res.json();
        console.log('Respuesta de Cloudinary:', data); // Verifica que esta respuesta contiene la URL

        if (data.secure_url) {
            return data.secure_url; // Devuelve la URL de la imagen o audio subido
        } else {
            throw new Error('No se recibió una URL segura de Cloudinary');
        }
    } catch (error) {
        console.error('Error al subir el archivo a Cloudinary:', error);
        return null;
    }
  };

  
  

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    if (currentStep < 4) {
      console.warn("Aún no estás en el último paso.");
      return;
    }
  
    let imageUrl = formData.image || null;
    let audioUrl = formData.audio || null;
  
    if (imageFile) {
      imageUrl = await uploadFile(imageFile);
      if (!imageUrl) {
        console.error("Error al subir la imagen.");
        return;
      }
      if (imageInputRef.current) {
        imageInputRef.current.value = null;
      }
    }
  
    if (audioFile) {
      audioUrl = await uploadFile(audioFile);
      if (!audioUrl) {
        console.error("Error al subir el audio.");
        return;
      }
      if (audioInputRef.current) {
        audioInputRef.current.value = null;
      }
    }
  
    const requestData = {
      ...formData,
      image: imageUrl,
      audio: audioUrl,
    };
  
    try {
      let response;
      if (editMode) {
        response = await fetch(
          `http://localhost:4000/api/markers/${markers[currentMarkerIndex]._id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData),
          }
        );
      } else {
        response = await fetch("http://localhost:4000/api/markers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData),
        });
      }
  
      if (!response.ok) {
        throw new Error("Error al guardar el marcador en la base de datos");
      }
  
      const savedMarker = await response.json();
  
      if (editMode) {
        const updatedMarkers = markers.map((marker, index) =>
          index === currentMarkerIndex ? savedMarker : marker
        );
        setMarkers(updatedMarkers);
      } else {
        setMarkers([...markers, savedMarker]);
      }
  
      handleCloseForm(); 
    } catch (error) {
      console.error("Error al enviar el marcador:", error);
    }
  };

  // Componente para manejar eventos de mapa y actualizar las coordenadas
  const LocationMarker = () => {
    const map = useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setFormData({
          ...formData,
          lat: lat,  // Mantiene la precisión completa
          lng: lng,  // Mantiene la precisión completa
        });
      },
      dragend(e) {
        const { lat, lng } = e.target.getLatLng();
        setFormData({
          ...formData,
          lat: lat,  // Mantiene la precisión completa
          lng: lng,  // Mantiene la precisión completa
        });
      },
    });

    return formData.lat && formData.lng ? (
      <Marker position={[formData.lat, formData.lng]}>
        <Popup>Ubicación seleccionada</Popup>
      </Marker>
    ) : null;
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 999,
        }}
        onClick={handleCloseForm}
      />
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "white",
          padding: "1.5rem",
          zIndex: 1000,
          width: "600px",
          maxHeight: "90%",
          overflowY: "auto",
          borderRadius: "8px",
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "translate(-50%, -50%)" : "translate(-50%, -70%)",
          transition: "all 0.3s ease-out", // Animación suave
        }}
      >
        <button
          onClick={handleCloseForm}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            backgroundColor: "transparent",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
            color: "#aaa",
          }}
        >
          ×
        </button>

        <ul className="steps mb-4">
          <li className={`step ${currentStep >= 1 ? "step-warning" : ""}`}>Ubicación</li>
          <li className={`step ${currentStep >= 2 ? "step-warning" : ""}`}>Información Básica</li>
          <li className={`step ${currentStep >= 3 ? "step-warning" : ""}`}>Archivos</li>
          <li className={`step ${currentStep >= 4 ? "step-warning" : ""}`}>Categoría</li>
        </ul>

        <form onSubmit={handleFormSubmit}>
          {currentStep === 1 && (
            <>
              <p style={ { textAlign: "center"}}>Selecciona la ubicación en el mapa.</p>
              <div style={{ height: "300px" }}>
                <MapContainer center={[formData.lat || -34.6037, formData.lng || -58.3816]} zoom={13} style={{ height: "100%" }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationMarker />
                </MapContainer>
              </div>
              <label>
                Latitud:
                <input type="number" name="lat" value={formData.lat} onChange={handleInputChange} step="any" readOnly />
              </label>
              <label>
                Longitud:
                <input type="number" name="lng" value={formData.lng} onChange={handleInputChange} step="any" readOnly />
              </label>
            </>
          )}
          {currentStep === 2 && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Nombre"
                value={formData.name}
                onChange={handleInputChange}
                required
                className='w-full border border-gray-300 rounded-md p-2'
              />
              <textarea
                name="description"
                placeholder="Descripción"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="5"
                className="h-32 w-full border border-gray-300 rounded-md p-2"
              />
            </>
          )}
          {currentStep === 3 && (
            <>
              <input
                type="file"
                name="image"
                onChange={handleMediaChange}
                ref={imageInputRef}
                className="my-2"
              />
              <input
                type="file"
                name="audio"
                onChange={handleMediaChange}
                ref={audioInputRef}
                className="my-2"
              />
            </>
          )}
          {currentStep === 4 && (
            <>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              >
                <option value="">Seleccione una categoría</option>
                <option value="escuela">Escuela</option>
                <option value="monumento">Monumento</option>
                <option value="museo">Museo</option>
                <option value="mastil">Mástil</option>
                <option value="ferrocarril">Ferrocarril</option>
                <option value="municipalidad">Municipalidad</option>
              </select>
            </>
          )}

          <div className="modal-action">
            {currentStep > 1 && (
              <button type="button" onClick={handlePrevious} className="btn btn-secondary">Atrás</button>
            )}
            {currentStep < 4 && (
              <button type="button" onClick={handleNext} className="btn btn-primary">Siguiente</button>
            )}
            {currentStep === 4 && (
              <button type="submit" className="btn btn-success">Guardar</button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default MarkerForm;
