import express from 'express';
import { createGalery , getGalery, updateGalery, deleteGalery } from '../controllers/galeryController.js';

const router = express.Router();

router.post('/', createGalery); // Ruta protegida
router.get('/', getGalery); // Ruta pública
router.put('/:id', updateGalery); // Ruta protegida
router.delete('/:id', deleteGalery); // Ruta protegida

export default router;