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
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar la animación
  const imageInputRef = useRef();
  const audioInputRef = useRef();
  

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

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const uploadData = new FormData();
    uploadData.append('file', file);
  
    try {
      const response = await fetch('http://localhost:4000/api/upload/upload', {
        method: 'POST',
        body: uploadData,
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log('Archivo subido correctamente:', data.url);
        // Aquí debes actualizar `formData` directamente
        setFormData((prevFormData) => ({
          ...prevFormData,
          [event.target.name]: data.url,
        }));
      } else {
        console.error('Error subiendo archivo:', data);
      }
    } catch (error) {
      console.error('Error al subir el archivo:', error);
    }
  };
  
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    if (currentStep < 4) {
      console.warn("Aún no estás en el último paso.");
      return;
    }
  
    if (!formData.image || !formData.audio) {
      alert("Por favor, selecciona tanto una imagen como un audio antes de enviar.");
      return;
    }
  
    try {
      let response;
  
      if (editMode) {
        response = await fetch(`http://localhost:4000/api/markers/${markers[currentMarkerIndex]._id}`, {
          method: "PUT",
          body: JSON.stringify(formData),
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        response = await fetch("http://localhost:4000/api/markers", {
          method: "POST",
          body: JSON.stringify(formData),
          headers: { 'Content-Type': 'application/json' },
        });
      }
  
      if (!response.ok) {
        const errorResponse = await response.text();
        console.error("Error del servidor:", errorResponse);
        throw new Error(`Error al guardar el marcador en la base de datos: ${errorResponse}`);
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
      alert("Hubo un error al guardar el marcador.");
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
              <p style={{ textAlign: "center" }}>Selecciona la ubicación en el mapa.</p>
              <div style={{ height: "300px" }}>
                <MapContainer center={[formData.lat || -34.6037, formData.lng || -58.3816]} zoom={13} style={{ height: "100%" }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
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
                className="w-full border border-gray-300 rounded-md p-2"
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
              <label>Imagen:</label>
              <input
                type="file"
                name="image"
                ref={imageInputRef}
                className="my-2"
                accept="image/*"
                onChange={handleFileChange} // Guardamos el archivo en el estado
              />
              <label htmlFor="audioInput">Selecciona un audio:</label>
              <input
                type="file"
                name="audio"
                ref={audioInputRef}
                accept="audio/*"
                onChange={handleFileChange}
              />
            </>
          )}
          {currentStep === 4 && (
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Selecciona una categoría</option>
              <option value="escuela">Escuela</option>
              <option value="monumento">Monumento</option>
              <option value="museo">Museo</option>
              <option value="mástil">Mástil</option>
              <option value="ferrocarril">Ferrocarril</option>
              <option value="municipalidad">Municipalidad</option>
            </select>
          )}
          <div className="mt-4 flex justify-between">
            {currentStep > 1 && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handlePrevious}
              >
                Atras
              </button>
            )}
            {currentStep < 4 ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleNext}
              >
                Siguiente
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-primary"
              >
                {editMode ? "Actualizar" : "Crear"} Marcador
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default MarkerForm;
