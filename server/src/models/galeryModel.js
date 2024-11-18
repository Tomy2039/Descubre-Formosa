import mongoose from "mongoose";

const galerySchema = new mongoose.Schema({
    name: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
}, { timestamps: true });

const Galery = mongoose.model('Galery', galerySchema);
export default Galery;