import { useState, useEffect } from "react";
import backgroundImage from "../assets/paseo-costanero.png"; // Imagen de fondo
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CollaboratorEvent = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para la búsqueda

  // Formatea la fecha al formato deseado (ejemplo: DD/MM/YYYY)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Cambiar formato si es necesario
  };

  // Obtener eventos del backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/events');
        const data = await response.json();
        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          console.error("Expected an array of events, but got:", data);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  // Filtrar eventos según la fecha seleccionada y el término de búsqueda
  const filteredEvents = events.filter((event) => {
    const eventDate = selectedDate ? new Date(event.date) : null;
    const isDateMatch =
      !selectedDate ||
      (eventDate.getDate() === selectedDate.getDate() &&
        eventDate.getMonth() === selectedDate.getMonth() &&
        eventDate.getFullYear() === selectedDate.getFullYear());
    const isNameMatch =
      event.name.toLowerCase().includes(searchTerm.toLowerCase());

    return isDateMatch && isNameMatch;
  });

  // Seleccionar evento para ver más detalles
  const handleViewEvent = (event) => {
    setSelectedEvent(event);
  };

  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row items-start lg:items-center bg-gray-100"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Información de eventos - Izquierda */}
      <div className="lg:w-1/2 p-8 lg:p-16 bg-yellow-100 bg-opacity-80 text-yellow-900">
        <h2 className="text-2xl font-bold mb-6">Eventos</h2>
        <p className="mb-4">
          <span className="font-semibold">DescubreFormosa</span> es una plataforma dedicada a promover la rica cultura, tradiciones y eventos de Formosa. Aquí podrás encontrar información sobre:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>Festivales y ferias culturales.</li>
          <li>Eventos de música y danza tradicional.</li>
          <li>Actividades al aire libre como paseos en canoa.</li>
          <li>Inauguraciones y encuentros culturales únicos.</li>
        </ul>
        <p className="mt-4">
          Explora las maravillas que Formosa tiene para ofrecer. ¡Planifica tu visita y disfruta de experiencias inolvidables!
        </p>
      </div>

      {/* Calendario y Eventos - Derecha */}
      <div className="lg:w-1/2 flex justify-center items-center p-8">
        <div className="bg-white bg-opacity-90 rounded-lg p-6 shadow-xl w-full max-w-md">
          <h2 className="text-xl font-semibold text-center mb-6">Selecciona una Fecha</h2>

          {/* Calendario */}
          <div className="mb-6">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="dd/MM/yyyy"
              className="input input-bordered input-primary w-96 text-center"
            />
          </div>

          {/* Barra de búsqueda */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Buscar evento por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered input-primary w-full"
            />
          </div>

          {/* Lista de eventos filtrados por fecha y nombre */}
          <h3 className="text-lg font-semibold text-center mb-4">
            {selectedDate ? `Eventos para el ${formatDate(selectedDate)}` : "Eventos Disponibles"}
          </h3>

          <div
            className="overflow-y-auto overflow-x-hidden" // Solo permite el scroll vertical
            style={{ maxHeight: "400px" }} // Limita la altura y activa el scroll solo vertical
          >
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <div
                  key={event._id}
                  className="card bg-blue-300 p-4 rounded-lg shadow-md border-2 border-blue-500 cursor-pointer transition-transform hover:scale-105"
                  onClick={() => handleViewEvent(event)} // Muestra el evento al hacer click
                >
                  {event.image && (
                    <img
                      src={event.image}
                      alt={event.name}
                      className="w-full h-40 object-cover mb-4 rounded-md"
                    />
                  )}
                  <h3 className="text-xl font-bold text-gray-700 text-center">{event.name}</h3>
                  <p className="text-sm text-gray-600 text-center mb-4">
                    {formatDate(event.date)} - {event.timeBegin} a {event.timeEnd}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No hay eventos disponibles para esta fecha.</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal para ver más detalles del evento */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="modal modal-open">
            <div className="modal-box bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold">{selectedEvent.name}</h2>
              <p className="mt-4 text-lg">{selectedEvent.description}</p>
              <p className="mt-2 text-sm text-gray-500">
                {formatDate(selectedEvent.date)} - {selectedEvent.timeBegin} a {selectedEvent.timeEnd}
              </p>
              {selectedEvent.image && (
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.name}
                  className="w-full h-64 object-cover mt-4 mb-4 rounded-md"
                />
              )}
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  onClick={() => setSelectedEvent(null)} // Cerrar el modal
                  className="btn btn-primary text-white"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollaboratorEvent;
