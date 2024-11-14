import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const router = express.Router();

// Configuración de la ruta absoluta para `uploads` (fuera de `src`)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadPath = path.join(__dirname, '../../uploads');  // Subir dos niveles para acceder a la carpeta raíz
const imagesPath = path.join(uploadPath, 'images');
const audiosPath = path.join(uploadPath, 'audios');

// Asegurarse de que las carpetas existen, si no, crearlas
const createFolderIfNotExist = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

createFolderIfNotExist(imagesPath);
createFolderIfNotExist(audiosPath);

// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Carpeta de almacenamiento de imagen y audio
    const folder = file.fieldname === 'image' ? imagesPath : audiosPath;
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    // Nombre único para cada archivo (timestamp + nombre original)
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Ruta para subir el archivo
router.post('/upload', upload.single('file'), (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).send('No se subió ningún archivo');

    // Devuelve la URL relativa del archivo para poder usarla en el frontend
    const fileType = file.mimetype.startsWith('image') ? 'images' : 'audios';
    res.json({ url: `/uploads/${fileType}/${file.filename}` });
  } catch (error) {
    console.error('Error al subir el archivo:', error);
    res.status(500).send('Error del servidor');
  }
});

export default router;
