import mongoose, { Schema } from "mongoose";
import IEvent from '../interfaces/IEvent';

const eventSchema = new Schema<IEvent>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  capacity: { type: Number, required: true },
  venue: { type: String, required: true },
  categories: [{ type: String }],
  tags: [{ type: String }],
  imageUrl: { type: String },
  isCanceled: { type: Boolean, default: false },
  latitude: { type: Number, required: false },
  longitude: { type: Number, required: false }, 
}, {
  timestamps: true,
});

export default mongoose.model<IEvent>("Event", eventSchema);