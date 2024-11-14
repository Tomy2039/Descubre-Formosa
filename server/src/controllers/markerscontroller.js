import Marker from '../models/markerModel.js';
import fs from 'fs';

// Crear un nuevo marcador
export const createMarker = async (req, res) => {
  console.log("datos recibidos", req.body);

  // Extraer los datos de la solicitud
  const { lat, lng, name, description, category } = req.body;
  if (!lat || !lng || !name || !description || !category) {
    return res.status(400).json({ message: 'Faltan campos obligatorios.' });
  }

  try {
    let imageUrl = '';
    let audioUrl = '';

    console.log(req.files);
    // Verifica si Multer ha subido los archivos correctamente
    if (req.files) {
      // Cargar imagen si existe
      if (req.files.image) {
        imageUrl = `/uploads/images/${req.files.image[0].filename}`;
      }

      // Cargar audio si existe
      if (req.files.audio) {
        audioUrl = `/uploads/audios/${req.files.audio[0].filename}`;
      }
    }

    // Crear nuevo marcador con los datos recibidos
    const newMarker = new Marker({
      location: { lat: parseFloat(lat), lng: parseFloat(lng) }, // Convertir a número
      name,
      description,
      category,
      image: imageUrl || undefined,
      audio: audioUrl || undefined,
    });

    // Guardar el marcador en la base de datos
    const savedMarker = await newMarker.save();
    res.status(201).json(savedMarker);  // Responde con el marcador guardado
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

// Obtener un marcador por su ID
export const getMarkerById = async (req, res) => {
  const { id } = req.params; // Obtener el ID del parámetro de la URL

  try {
    const marker = await Marker.findById(id); // Buscar el marcador en la base de datos por ID

    if (!marker) {
      return res.status(404).json({ message: 'Marcador no encontrado' });
    }

    res.status(200).json(marker); // Devolver el marcador encontrado
  } catch (error) {
    console.error('Error al obtener el marcador:', error);
    res.status(500).json({ message: 'Error al obtener el marcador' });
  }
};


// Actualizar un marcador existente
export const updateMarker = async (req, res) => {
  const { name, description, category } = req.body;

  if (!name || !description || !category) {
    return res.status(400).json({ message: 'Faltan campos obligatorios.' });
  }

  try {
    let updatedFields = { ...req.body }; // Campos actualizados

    // Subida de archivos en la actualización
    if (req.files) {
      if (req.files.image) {
        try {
          const imagePath = req.files.image[0].path; // Obtener la ruta local de la imagen cargada
          updatedFields.image = `/upload/${req.files.image[0].filename}`; // Ruta de la imagen en el servidor
        } catch (err) {
          console.error("Error al cargar la imagen:", err);
          return res.status(500).json({ message: 'Error al cargar la imagen' });
        }
      }

      if (req.files.audio) {
        try {
          const audioPath = req.files.audio[0].path; // Obtener la ruta local del audio cargado
          updatedFields.audio = `/upload/${req.files.audio[0].filename}`; // Ruta del audio en el servidor
        } catch (err) {
          console.error("Error al cargar el audio:", err);
          return res.status(500).json({ message: 'Error al cargar el audio' });
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
