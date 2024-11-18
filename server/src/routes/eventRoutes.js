import express from 'express';
import { createEvent, getEvents, updateEvent,  deleteEvent } from '../controllers/eventController.js';

const router = express.Router();

router.post('/', createEvent); // Ruta protegida
router.get('/', getEvents); // Ruta pública
router.put('/:id',  updateEvent); // Ruta protegida
router.delete('/:id', deleteEvent); // Ruta protegida

export default router;