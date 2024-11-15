import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import customIcon from '../assets/Formosa-removebg-preview.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

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

const MapMarkers = () => {
  const [markers, setMarkers] = useState([]);
  const [filteredMarkers, setFilteredMarkers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(''); // Estado para la categoría seleccionada

  const categories = ['escuela', 'monumento', 'museo', 'mastil', 'ferrocarril', 'municipalidad']; // Definir las categorías en minúsculas

  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/markers');
        const data = await response.json();
        if (Array.isArray(data)) {
          setMarkers(data);
          setFilteredMarkers(data); // Inicialmente, todos los marcadores están filtrados
        } else {
          console.error("Expected an array of markers, but got:", data);
        }
      } catch (error) {
        console.error('Error fetching markers:', error);
      }
    };
    fetchMarkers();
  }, []);

  // Filtrar los marcadores según el texto de búsqueda y la categoría seleccionada
  useEffect(() => {
    const filtered = markers.filter(marker => {
      const matchesSearch = marker.name.toLowerCase().includes(searchText.toLowerCase());
      const matchesCategory = selectedCategory ? marker.category.toLowerCase() === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
    setFilteredMarkers(filtered);
  }, [searchText, selectedCategory, markers]);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        // Aquí se eliminaron las acciones para abrir el formulario
      },
    });
    return null;
  };

  return (
    <div>
      {/* Barra de búsqueda y filtro por categoría */}
      <div className="bg-yellow-200 text-black p-4 flex gap-4 items-center justify-between">
        <input
          type="text"
          className="input input-bordered w-full max-w-xs rounded-md"
          placeholder="Buscar por nombre..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <h1 className='text-4xl text-orange-600 font-bold'>Mapa Interactivo</h1>
        <select
          className="select select-bordered w-full max-w-xs rounded-md"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {categories.map((category, idx) => (
            <option key={idx} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <MapContainer center={[-26.1855, -58.1729]} zoom={13} style={{ height: "89vh", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapClickHandler />

        {filteredMarkers.map((marker, idx) => (
          marker.location && marker.location.lat !== undefined && marker.location.lng !== undefined ? (
            <Marker key={idx} position={[marker.location.lat, marker.location.lng]} icon={customMarkerIcon}>
              <Popup>
                <div className="card card-compact bg-base-100 w-64 shadow-xl">
                  <figure>
                    {marker.image && (
                      <img 
                        src={marker.image} 
                        alt={marker.name} 
                        className="max-h-48 w-full object-cover" 
                        onError={(e) => e.target.src = '/path/to/default/image.jpg'} // Fallback image if broken
                      />
                    )}
                  </figure>
                  <div className="card-body p-3">
                    <h2 className="card-title text-sm">{marker.name}</h2>
                    <p className="text-xs">Categoría: {marker.category}</p>
                    <div className="card-actions justify-end">
                      <button className="btn btn-xs" onClick={() => document.getElementById('my_modal_1').showModal()}>Ver Más</button>
                    </div>
                  </div>
                </div>

                <dialog id="my_modal_1" className="modal">
                  <div className="modal-box">
                    <h3 className="font-bold text-lg">{marker.name}</h3>
                    <p className="py-4">{marker.description}</p>
                    <p>Categoría: {marker.category}</p>
                    {marker.image && (
                      <img 
                        src={marker.image} 
                        alt={marker.name} 
                        className="max-h-64 w-full object-cover" 
                        onError={(e) => e.target.src = '/path/to/default/image.jpg'} // Fallback for images
                      />
                    )}
                    {marker.audio && (
                      <audio controls>
                        <source src={marker.audio} type="audio/mp3" />
                        <source src={marker.audio} type="audio/wav" />
                        <source src={marker.audio} type="audio/ogg" />
                        Your browser does not support the audio element.
                      </audio>
                    )}
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
      </MapContainer>
    </div>
  );
};

export default MapMarkers;
