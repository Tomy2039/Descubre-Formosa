import mongoose from 'mongoose';

const markerSchema = new mongoose.Schema({
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String },
  audio: { type: String },
}, {
  timestamps: true
});

// Asegúrate de exportar el modelo con `export default`
const Marker = mongoose.model('Marker', markerSchema);
export default Marker;
