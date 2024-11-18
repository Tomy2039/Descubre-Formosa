import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    timeBegin: { type: String, required: true },
    timeEnd: { type: String, required: true },
    image: { type: String },
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
export default Event;