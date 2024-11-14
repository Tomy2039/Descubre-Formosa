import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Crear las carpetas si no existen
const ensureDirExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Asegurar que las carpetas existen
ensureDirExists(path.join('uploads', 'images'));
ensureDirExists(path.join('uploads', 'audios'));

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determina la carpeta de destino dependiendo del tipo de archivo
    const folder = file.mimetype.includes('image') ? 'images' : 'audios';
    cb(null, path.join('uploads', folder)); // Carpeta uploads/images o uploads/audios
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre único para cada archivo
  },
});

const upload = multer({ storage });

// Exportar la configuración de multer
export default upload;

