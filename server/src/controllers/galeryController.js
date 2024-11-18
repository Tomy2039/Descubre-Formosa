import Galery from '../models/galeryModel.js';
import { uploadImage } from '../db/cloudinary.js';
import fs from 'fs';

export const createGalery  = async (req, res) => {
    const { name, author, description, useCloudinary, image } = req.body;
    console.log(req.body)
    if (!name || !author || !description) {
      return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }
  
    try {
    
      console.log("Archivos recibidos:", req.files);
      console.log("Datos del formulario:", req.body);
      console.log("Uso de Cloudinary:", useCloudinary);
  
      // Crear nuevo marcador
      const newGalery = new Galery({
        name,
        author,
        description,
        image
      });
  
      await newGalery.save();
      res.status(201).json(newGalery);
      console.log("Nuevo Arte creado:", newGalery);
    } catch (error) {
      console.error("Error al crear el Arte:", error);
      res.status(500).json({ message: 'Error al crear el Arte' });
    }
};

export const getGalery = async (req, res) => {
    try {
      const galeries = await Galery.find();
      res.status(200).json(galeries);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener la galeria' });
    }
};

export const updateGalery = async (req, res) => {
    const { name, author, description, useCloudinary } = req.body;
  
    if (!name || !author || !description) {
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
  
      const updatedGalery = await Galery.findByIdAndUpdate(req.params.id, updatedFields, { new: true });
      res.status(200).json(updatedGalery);
    } catch (error) {
      console.error("Error al actualizar el arte:", error);
      res.status(500).json({ message: 'Error al actualizar el Arte' });
    }
};

export const deleteGalery = async (req, res) => {
    try {
      await Galery.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Arte eliminado correctamente' });
    } catch (error) {
      console.error("Error al eliminar el Arte:", error);
      res.status(500).json({ message: 'Error al eliminar el Arte' });
    }
  };
  