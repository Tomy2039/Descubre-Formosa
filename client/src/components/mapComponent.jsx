import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import MarkerForm from './MarkerForm';

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
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
    lat: -26.1855,  // Latitud predeterminada
    lng: -58.1729,  // Longitud predeterminada
  });
  const [isDraggableMarkerActive, setIsDraggableMarkerActive] = useState(false);

  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/markers');
        const data = await response.json();
        setMarkers(data);
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
      },
    });
    return null;
  };

  const handleEditMarker = (index) => {
    const markerToEdit = markers[index];
    setFormData(markerToEdit);
    setShowForm(true);
    setEditMode(true);
    setCurrentMarkerIndex(index);
    setIsDraggableMarkerActive(true); // Activa el marcador editable
  };

  const handleDeleteMarker = async (index) => {
    await fetch(`http://localhost:4000/api/markers/${markers[index]._id}`, {
      method: 'DELETE',
    });
    const updatedMarkers = markers.filter((_, i) => i !== index);
    setMarkers(updatedMarkers);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setFormData({ name: '', description: '', category: '', image: null, audio: null, lat: -26.1855, lng: -58.1729 });
    setCurrentMarkerIndex(null);
    setIsDraggableMarkerActive(false);  // Desactiva el marcador cuando se cierra el formulario
  };

  const handleDragEnd = (e) => {
    const { lat, lng } = e.target.getLatLng();
    setFormData((prevData) => ({ ...prevData, lat, lng }));
};

  return (
    <>
      <MapContainer center={[-26.1855, -58.1729]} zoom={13} style={{ height: "88vh", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapClickHandler />

        {markers.map((marker, idx) => (
  marker.lat !== undefined && marker.lng !== undefined ? (
    <Marker key={idx} position={[marker.lat, marker.lng]} icon={defaultIcon}>
      <Popup>
        <h3>{marker.name}</h3>
        <p>{marker.description}</p>
        <p>Categoría: {marker.category}</p>
        {marker.audio && <audio controls src={marker.audio} />}
        {marker.image && <img src={marker.image} alt={marker.name} style={{ width: "100px", height: "100px" }} />}
        <div style={{ marginTop: '10px' }}>
          <button onClick={() => handleEditMarker(idx)}>Editar</button>
          <button onClick={() => handleDeleteMarker(idx)} style={{ marginLeft: '5px' }}>Eliminar</button>
        </div>
      </Popup>
    </Marker>
  ) : null // No renderizar si las coordenadas están indefinidas
))}


        {isDraggableMarkerActive && (
          <Marker
            position={[formData.lat, formData.lng]}
            icon={defaultIcon}
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
        />
      )}
    </>
  );
};

export default MapComponent;
