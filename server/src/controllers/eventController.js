import Event from '../models/eventModel.js';
import { uploadImage } from '../db/cloudinary.js';
import fs from 'fs';

export const createEvent  = async (req, res) => {
    const { name, description, date, timeBegin, timeEnd, useCloudinary, image} = req.body;
    console.log(req.body)
    if (!name || !description || !date || !timeBegin || !timeEnd) {
      return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }
  
    try {
    
      console.log("Archivos recibidos:", req.files);
      console.log("Datos del formulario:", req.body);
      console.log("Uso de Cloudinary:", useCloudinary);
  
      // Crear nuevo marcador
      const newEvent = new Event({
        name,
        description,
        date,
        timeBegin,
        timeEnd,
        image
      });
  
      await newEvent.save();
      res.status(201).json(newEvent);
      console.log("Nuevo Evento creado:", newEvent);
    } catch (error) {
      console.error("Error al crear el Evento:", error);
      res.status(500).json({ message: 'Error al crear el Evento' });
    }
};

export const getEvents = async (req, res) => {
    try {
      const events = await Event.find();
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los eventos' });
    }
};

export const updateEvent = async (req, res) => {
    const { name, description, date, timeBegin, timeEnd, useCloudinary } = req.body;
  
    if (!name || !description || !date || !timeBegin || !timeEnd) {
      return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }
  
    try {
      let updatedFields = { ...req.body }; // Campos actualizados
  
      // Subida de archivos en la actualización
      if ((useCloudinary === 'true' || useCloudinary === true) && req.files) {
        if (req.files.image) {
          try {
            const imagePath = req.files.image.tempFilePath;
            const imageResult = await uploadImage(imagePath);
            updatedFields.image = imageResult.secure_url;
            fs.unlinkSync(imagePath); // Eliminar archivo temporal
          } catch (err) {
            console.error("Error al subir la imagen en Cloudinary:", err);
            return res.status(500).json({ message: 'Error al cargar la imagen en Cloudinary' });
          }
        }
      }
  
      const updatedEvent = await Event.findByIdAndUpdate(req.params.id, updatedFields, { new: true });
      res.status(200).json(updatedEvent);
    } catch (error) {
      console.error("Error al actualizar el Evento:", error);
      res.status(500).json({ message: 'Error al actualizar el Evento' });
    }
};

export const deleteEvent = async (req, res) => {
    try {
      await Event.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Evento eliminado correctamente' });
    } catch (error) {
      console.error("Error al eliminar el Evento:", error);
      res.status(500).json({ message: 'Error al eliminar el evento' });
    }
  };
  