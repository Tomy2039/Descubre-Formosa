import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const EventForm = ({ event, editMode, onSave, onClose }) => {
  const [formEvent, setFormEvent] = useState({
    name: '',
    description: '',
    date: '',
    timeBegin: '',
    timeEnd: '',
    image: null,
  });

  const imageInputRef = useRef();

  // Si estamos en modo edición, llenar el formulario con los datos del evento
  useEffect(() => {
    if (editMode && event) {
      setFormEvent({
        name: event.name || '',
        description: event.description || '',
        date: event.date || '',
        timeBegin: event.timeBegin || '',
        timeEnd: event.timeEnd || '',
        image: event.image || null,
      });
    }
  }, [editMode, event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value,
    }));
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('upload_preset', 'DF_preset'); // Agregar el upload_preset aquí
    
    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dtzgpdbyx/upload', {
        method: 'POST',
        body: uploadData,
      });
  
      const data = await response.json(); // Espera la respuesta JSON
      console.log('Respuesta de Cloudinary:', data);
  
      if (data.secure_url) {
        // Asigna la URL de la imagen a formEvent.image
        setFormEvent((prevEvent) => ({
          ...prevEvent,
          image: data.secure_url,
        }));
      } else {
        throw new Error('No se recibió una URL segura de Cloudinary');
      }
    } catch (error) {
      console.error('Error al subir el archivo:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', formEvent.name);
    formData.append('description', formEvent.description);
    formData.append('date', formEvent.date);
    formData.append('timeBegin', formEvent.timeBegin);
    formData.append('timeEnd', formEvent.timeEnd);
    if (formEvent.image) formData.append('image', formEvent.image);

    try {
      let response;
      if (editMode && event) {
        // Editar evento existente
        response = await axios.put(`http://localhost:4000/api/events/${event._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // Crear nuevo evento
        response = await axios.post('http://localhost:4000/api/events', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      console.log('Evento guardado:', response.data);
      onSave(response.data); // Llamar la función onSave para actualizar el estado en el componente principal
      onClose(); // Cerrar el formulario después de guardar
    } catch (error) {
      console.error('Error al guardar el evento:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow-md">
      <div>
        <label htmlFor="name" className="block">Nombre</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formEvent.name}
          onChange={handleChange}
          required
          className="input input-bordered w-full mb-2"
        />
      </div>
      <div>
        <label htmlFor="description" className="block">Descripción</label>
        <input
          type="text"
          id="description"
          name="description"
          value={formEvent.description}
          onChange={handleChange}
          required
          className="input input-bordered w-full mb-2"
        />
      </div>
      <div>
        <label htmlFor="date" className="block">Fecha</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formEvent.date}
          onChange={handleChange}
          required
          className="input input-bordered w-full mb-2"
        />
      </div>
      <div>
        <label htmlFor="timeBegin" className="block">Hora de inicio</label>
        <input
          type="time"
          id="timeBegin"
          name="timeBegin"
          value={formEvent.timeBegin}
          onChange={handleChange}
          required
          className="input input-bordered w-full mb-2"
        />
      </div>
      <div>
        <label htmlFor="timeEnd" className="block">Hora de fin</label>
        <input
          type="time"
          id="timeEnd"
          name="timeEnd"
          value={formEvent.timeEnd}
          onChange={handleChange}
          required
          className="input input-bordered w-full mb-2"
        />
      </div>
      <div>
        <label htmlFor="image" className="block">Imagen</label>
        <input
          type="file"
          id="image"
          name="image"
          onChange={handleFileChange}
          className="file-input file-input-bordered w-full mb-2"
        />
      </div>
      <button type="submit" className="btn btn-primary w-full">{editMode ? 'Actualizar Evento' : 'Crear Evento'}</button>
      <button
        type="button"
        onClick={onClose}
        className="btn btn-secondary w-full mt-2"
      >
        Cerrar Formulario
      </button>
    </form>
  );
};

export default EventForm;
