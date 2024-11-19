import mongoose from 'mongoose';

const songSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    artist: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    image: { type: String },  // URL de la imagen
    audio: { type: String, required: true }  // URL del archivo de audio
  },
  { timestamps: true }
);

const Song = mongoose.model('Song', songSchema);
export default Song;
