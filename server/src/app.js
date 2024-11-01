import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './db/db.js';
import markerRoutes from './routes/markerRoutes.js';
import authRoutes from './routes/authRoutes.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Usar path para rutas (con ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173',}));
app.use(express.json());
app.use(fileUpload({ useTempFiles: true, tempFileDir: './uploads'}));

// Servir imágenes locales
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas
app.use('/api/markers', markerRoutes);

// Agregar las rutas de autenticación
app.use('/api/auth', authRoutes);

// Conexión a la base de datos
connectDB();

// Levantar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
