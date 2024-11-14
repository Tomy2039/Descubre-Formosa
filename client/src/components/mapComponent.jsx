import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import customIcon from '../assets/Formosa-removebg-preview.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import MarkerForm from './markerForm';

// Configuración del icono de marcador personalizado con sombra
const customMarkerIcon = L.icon({
  iconUrl: customIcon,
  shadowUrl: markerShadow,
  iconSize: [40, 40], // Ajusta el tamaño según tus necesidades
  shadowSize: [41, 41], // Tamaño de la sombra
  iconAnchor: [20, 40], // Ancla del icono
  shadowAnchor: [12, 41], // Ancla de la sombra
  popupAnchor: [0, -40], // Ancla del popup
});

const MapComponent = () => {
  const [markers, setMarkers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentMarkerIndex, setCurrentMarkerIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    image: null,
    audio: null,
    lat: -26.1855,
    lng: -58.1729,
  });
  const [isDraggableMarkerActive, setIsDraggableMarkerActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/markers');
        const data = await response.json();
        if (Array.isArray(data)) {
          setMarkers(data);
        } else {
          console.error("Expected an array of markers, but got:", data);
        }
      } catch (error) {
        console.error('Error fetching markers:', error);
      }
    };
    fetchMarkers();
  }, []);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setShowForm(true);
        setEditMode(false);
        setFormData({ ...formData, lat: e.latlng.lat, lng: e.latlng.lng });
        setIsDraggableMarkerActive(true);
        setCurrentStep(1);
      },
    });
    return null;
  };

  const handleEditMarker = (index) => {
    const markerToEdit = markers[index];
    if (markerToEdit && markerToEdit.location) {
      const { lat, lng } = markerToEdit.location;
      setFormData({
        ...formData,
        ...markerToEdit,
        lat: lat || -26.1855,
        lng: lng || -58.1729,
      });
    }
    setShowForm(true);
    setEditMode(true);
    setCurrentMarkerIndex(index);
    setIsDraggableMarkerActive(true);
    setCurrentStep(1);
  };

  const handleDeleteMarker = async (index) => {
    try {
      await fetch(`http://localhost:4000/api/markers/${markers[index]._id}`, {
        method: 'DELETE',
      });
      const updatedMarkers = markers.filter((_, i) => i !== index);
      setMarkers(updatedMarkers);
    } catch (error) {
      console.error("Error deleting marker:", error);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setFormData({ name: '', description: '', category: '', image: null, audio: null, lat: -26.1855, lng: -58.1729 });
    setCurrentMarkerIndex(null);
    setIsDraggableMarkerActive(false);
    setCurrentStep(1);
  };

  const handleDragEnd = (e) => {
    const { lat, lng } = e.target.getLatLng();
    setFormData((prevData) => ({ ...prevData, lat, lng }));
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <>
      <MapContainer center={[-26.1855, -58.1729]} zoom={13} style={{ height: "93vh", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapClickHandler />

        {markers.map((marker, idx) => (
          marker.location && marker.location.lat !== undefined && marker.location.lng !== undefined ? (
            <Marker key={idx} position={[marker.location.lat, marker.location.lng]} icon={customMarkerIcon}>
              <Popup>
                <div className="card card-compact bg-base-100 w-64 shadow-xl">
                  <figure>
                    {marker.image && <img src={`http://localhost:4000/uploads/${marker.image}`} alt={marker.name} className="max-h-64 w-full object-cover" />}
                  </figure>
                  <div className="card-body p-3">
                    <h2 className="card-title text-sm">{marker.name}</h2>
                    <p className="text-xs">Categoría: {marker.category}</p>
                    <div className="card-actions justify-end">
                      <button className="btn btn-primary btn-xs" onClick={() => handleEditMarker(idx)}>Editar</button>
                      <button className="btn btn-error btn-xs" onClick={() => handleDeleteMarker(idx)}>Eliminar</button>
                      <button className="btn btn-xs" onClick={() => document.getElementById('my_modal_1').showModal()}>Ver Más</button>
                    </div>
                  </div>
                </div>

                <dialog id="my_modal_1" className="modal">
                  <div className="modal-box">
                    <h3 className="font-bold text-lg">{marker.name}</h3>
                    <p className="py-4">{marker.description}</p>
                    <p>Categoría: {marker.category}</p>
                    {marker.image && <img src={`http://localhost:4000/uploads/${marker.image}`} alt={marker.name} className="max-h-64 w-full object-cover" />}
                    {marker.audio && <audio controls src={`http://localhost:4000/uploads/${marker.audio}`} />}
                    <div className="modal-action">
                      <form method="dialog">
                        <button className="btn">Cerrar</button>
                      </form>
                    </div>
                  </div>
                </dialog>
              </Popup>
            </Marker>
          ) : null
        ))}

        {isDraggableMarkerActive && (
          <Marker
            position={[formData.lat, formData.lng]}
            icon={customMarkerIcon}
            draggable={true}
            eventHandlers={{
              dragend: handleDragEnd,
            }}
          >
            <Popup>
              <h3>Marcador editable</h3>
              <p>Latitud: {formData.lat}</p>
              <p>Longitud: {formData.lng}</p>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {showForm && (
        <MarkerForm
          formData={formData}
          setFormData={setFormData}
          editMode={editMode}
          setMarkers={setMarkers}
          markers={markers}
          currentMarkerIndex={currentMarkerIndex}
          handleCloseForm={handleCloseForm}
          currentStep={currentStep}
          handleNextStep={handleNextStep}
          handlePrevStep={handlePrevStep}
        />
      )}
    </>
  );
};

export default MapComponent;
