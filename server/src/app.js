import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './db/db.js';
import markerRoutes from './routes/markerRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Usar path para rutas (con ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173', // Puedes configurar la URL de tu frontend aquí
}));
app.use(express.json());
app.use(fileUpload({ tempFileDir: './src/uploads',useTempFiles: true }));

// Servir imágenes locales
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas
app.use('/api/markers', markerRoutes);
app.use('/api/auth', authRoutes);

// Conexión a la base de datos
connectDB();

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo salió mal, por favor intenta de nuevo más tarde.' });
});

// Levantar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
