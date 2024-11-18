import { useState, useEffect } from "react";
import EventForm from "../components/eventForm";

const CollaboratorEvent = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

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

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedEvent(null);
    setEditMode(false);
  };

  const handleAddEvent = () => {
    setIsFormOpen(true);
    setEditMode(false);
    setSelectedEvent(null);
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setEditMode(true);
    setIsFormOpen(true);
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/events/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar evento.");
      }

      setEvents((prevEvents) => prevEvents.filter((event) => event._id !== eventId));
    } catch (error) {
      console.error("Error al eliminar evento:", error);
    }
  };

  const handleSaveEvent = (eventData) => {
    if (editMode) {
      setEvents((prevEvents) =>
        prevEvents.map((event) => (event._id === eventData._id ? eventData : event))
      );
    } else {
      setEvents((prevEvents) => [...prevEvents, eventData]);
    }
    handleCloseForm();
  };

  return (
    <div className="p-6 bg-blue-200 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700 mb-8 shadow-lg">
          Mis Eventos
        </h1>
        <p className="text-center text-lg text-gray-800 mb-8 italic">
          Crea, edita y administra los eventos de tu comunidad.
        </p>
        <div className="flex justify-center mb-6">
          <button
            onClick={handleAddEvent}
            className="btn btn-primary px-6 py-3 text-white font-bold rounded-md shadow-xl hover:bg-blue-500 transform transition duration-200 ease-in-out"
          >
            Agregar Evento
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mx-auto">
          {events.map((event) => (
            <div
              key={event._id}
              className="card bg-blue-300 p-4 rounded-lg shadow-md border-2 border-blue-500 cursor-pointer transition-transform hover:scale-105"
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
              <div className="flex justify-center mt-2 space-x-4">
                <button
                  onClick={() => handleEditEvent(event)}
                  className="btn btn-info text-lg text-blue-700 hover:text-blue-600 font-semibold"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteEvent(event._id)}
                  className="btn btn-error text-lg text-red-600 hover:text-red-500 font-semibold"
                >
                  Eliminar
                </button>
                <button
                  onClick={() => setSelectedEvent(event)}
                  className="btn btn-secondary text-lg text-blue-700 hover:text-blue-600 font-semibold"
                >
                  Ver Más
                </button>
              </div>
            </div>
          ))}
        </div>

        {isFormOpen && (
          <EventForm
            event={selectedEvent}
            editMode={editMode}
            onSave={handleSaveEvent}
            onClose={handleCloseForm}
          />
        )}

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
                    onClick={() => setSelectedEvent(null)}
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
    </div>
  );
};

export default CollaboratorEvent;