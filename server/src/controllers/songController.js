import Song  from '../models/songModel.js';
import { uploadImage, uploadAudio } from '../db/cloudinary.js';
import fs from 'fs';

// Crear un nuevo marcador
export const createSong = async (req, res) => {
    const { title, artist, description, category, useCloudinary, image, audio } = req.body;
  console.log(req.body)
    if (!title || !artist || !description || !category) {
      return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }
  
    try {  
      console.log("Archivos recibidos:", req.files);
      console.log("Datos del formulario:", req.body);
      console.log("Uso de Cloudinary:", useCloudinary);
  
      // Crear nuevo marcador
      const newSong = new Song({
        title, 
        artist,
        description,
        category,
        image,
        audio
      });
  
      await newSong.save();
      res.status(201).json(newSong);
      console.log("Nueva cancion creada:", newSong);
    } catch (error) {
      console.error("Error al crear la cancion:", error);
      res.status(500).json({ message: 'Error al crear la cancion' });
    }
  };
  
  // Obtener todos los marcadores
  export const getSongs = async (req, res) => {
    try {
      const songs = await Song.find();
      res.status(200).json(songs);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener las canciones' });
    }
  };
  
  // Actualizar un marcador existente
  export const updateSong = async (req, res) => {
    const { title, artist, description, category, useCloudinary } = req.body;
  
    if (!title || !artist || !description || !category) {
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
  
        if (req.files.audio) {
          try {
            const audioPath = req.files.audio.tempFilePath;
            const audioResult = await uploadAudio(audioPath);
            updatedFields.audio = audioResult.secure_url;
            fs.unlinkSync(audioPath); // Eliminar archivo temporal
          } catch (err) {
            console.error("Error al subir el audio en Cloudinary:", err);
            return res.status(500).json({ message: 'Error al cargar el audio en Cloudinary' });
          }
        }
      }
  
      const updatedSong = await Song.findByIdAndUpdate(req.params.id, updatedFields, { new: true });
      res.status(200).json(updatedSong);
    } catch (error) {
      console.error("Error al actualizar la cancion:", error);
      res.status(500).json({ message: 'Error al actualizar la cancion' });
    }
  };
  
  // Eliminar un marcador
  export const deleteSong = async (req, res) => {
    try {
      await Song.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Cancion eliminado correctamente' });
    } catch (error) {
      console.error("Error al eliminar La cancion:", error);
      res.status(500).json({ message: 'Error al eliminar la cancion' });
    }
  };
  