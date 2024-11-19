import express from 'express';
import { createSong, getSongs, updateSong, deleteSong} from '../controllers/songController.js';

const router = express.Router();

router.post('/', createSong); // Ruta protegida
router.get('/', getSongs); // Ruta pública
router.put('/:id',  updateSong); // Ruta protegida
router.delete('/:id', deleteSong); // Ruta protegida

export default router;