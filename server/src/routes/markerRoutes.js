import express from 'express';
import { createMarker, getMarkers, updateMarker, deleteMarker } from '../controllers/markerscontroller.js';

const router = express.Router();

router.post('/', createMarker); // Ruta protegida
router.get('/', getMarkers); // Ruta pública
router.put('/:id',  updateMarker); // Ruta protegida
router.delete('/:id', deleteMarker); // Ruta protegida

export default router;

