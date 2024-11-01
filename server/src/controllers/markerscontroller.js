import Marker from '../models/markerModel.js';
import cloudinary from '../db/cloudinary.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear un nuevo marcador
export const createMarker = async (req, res) => {
  const { lat, lng, name, description, category, useCloudinary } = req.body;

  if (!lat || !lng || !name || !description || !category) {
    return res.status(400).json({ message: 'Faltan campos obligatorios.' });
  }

  try {
    let imageUrl = '';
    let audioUrl = '';

    console.log("Archivos recibidos:", req.files);
    console.log("Datos del formulario:", req.body);
    console.log("Uso de Cloudinary:", useCloudinary);

    if ((useCloudinary === 'true' || useCloudinary === true) && req.files) {
      if (req.files.image) {
        try {
          const imageResult = await cloudinary.uploader.upload(req.files.image.tempFilePath, { folder: 'markers' });
          imageUrl = imageResult.secure_url;
          console.log("Resultado de la imagen:", imageResult);
          fs.unlinkSync(req.files.image.tempFilePath);
        } catch (err) {
          console.error("Error al subir la imagen a Cloudinary:", err);
          return res.status(500).json({ message: 'Error al cargar la imagen en Cloudinary' });
        }
      }
      

      if (req.files.audio) {
        try {
          const audioResult = await cloudinary.uploader.upload(req.files.audio.tempFilePath, {
            folder: 'markers/audios',
            resource_type: 'video',
          });
          audioUrl = audioResult.secure_url;
          console.log("Resultado del audio:", audioResult);
          fs.unlinkSync(req.files.audio.tempFilePath);
        } catch (err) {
          console.error("Error al subir el audio a Cloudinary:", err);
          return res.status(500).json({ message: 'Error al cargar el audio en Cloudinary' });
        }
      }
    }

    const newMarker = new Marker({
      location: { lat, lng },
      name,
      description,
      category,
      image: imageUrl || undefined,
      audio: audioUrl || undefined,
    });

    await newMarker.save();
    res.status(201).json(newMarker);
    console.log("Nuevo marcador creado:", newMarker);
  } catch (error) {
    console.error("Error al crear el marcador:", error);
    res.status(500).json({ message: 'Error al crear el marcador' });
  }
};

// Obtener todos los marcadores
export const getMarkers = async (req, res) => {
  try {
    const markers = await Marker.find();
    res.status(200).json(markers);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los marcadores' });
  }
};

// Actualizar un marcador existente
export const updateMarker = async (req, res) => {
  const { name, description, category, useCloudinary } = req.body;
  
  if (!name || !description || !category) {
    return res.status(400).json({ message: 'Faltan campos obligatorios.' });
  }

  try {
    let updatedFields = { ...req.body }; // Campos actualizados

    // Subida de archivos en la actualización
    if ((useCloudinary === 'true' || useCloudinary === true) && req.files) {
      if (req.files.image) {
        try {
          const imageResult = await cloudinary.uploader.upload(req.files.image.tempFilePath, { folder: 'markers' });
          updatedFields.image = imageResult.secure_url;
          fs.unlinkSync(req.files.image.tempFilePath); // Eliminar archivo temporal
        } catch (err) {
          console.error("Error al subir la imagen en Cloudinary:", err);
          return res.status(500).json({ message: 'Error al cargar la imagen en Cloudinary' });
        }
      }

      if (req.files.audio) {
        try {
          const audioResult = await cloudinary.uploader.upload(req.files.audio.tempFilePath, {
            folder: 'markers/audios',
            resource_type: 'video',
          });
          updatedFields.audio = audioResult.secure_url;
          fs.unlinkSync(req.files.audio.tempFilePath); // Eliminar archivo temporal
        } catch (err) {
          console.error("Error al subir el audio en Cloudinary:", err);
          return res.status(500).json({ message: 'Error al cargar el audio en Cloudinary' });
        }
      }
    }

    const updatedMarker = await Marker.findByIdAndUpdate(req.params.id, updatedFields, { new: true });
    res.status(200).json(updatedMarker);
  } catch (error) {
    console.error("Error al actualizar el marcador:", error);
    res.status(500).json({ message: 'Error al actualizar el marcador' });
  }
};

// Eliminar un marcador
export const deleteMarker = async (req, res) => {
  try {
    await Marker.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Marcador eliminado correctamente' });
  } catch (error) {
    console.error("Error al eliminar el marcador:", error);
    res.status(500).json({ message: 'Error al eliminar el marcador' });
  }
};
