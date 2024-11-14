import express from 'express';
import upload from '../db/multerConfig.js'; // Importar configuración de Multer
import { createMarker, getMarkers, getMarkerById, updateMarker, deleteMarker } from '../controllers/markerscontroller.js';

const router = express.Router();

// Para la creación de marcadores, donde esperamos archivos
router.post('/', upload.fields([{ name: 'image' }, { name: 'audio' }]), createMarker); 

// Obtener todos los marcadores
router.get('/', getMarkers);
router.get('/:id', getMarkerById);


// Actualizar un marcador existente, donde esperamos archivos
router.put('/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'audio', maxCount: 1 }]), updateMarker); 

// Eliminar un marcador
router.delete('/:id', deleteMarker);

export default router;
