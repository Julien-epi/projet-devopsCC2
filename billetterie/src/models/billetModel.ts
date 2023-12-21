import mongoose, { Schema, Document } from "mongoose";
import IBillet from "../interfaces/IBillet";

interface BilletDocument extends IBillet, Document {}

const billetSchema = new Schema<BilletDocument>({
  eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  nom: { type: String, required: true }, 
  prix: { type: Number, required: true },
  quantiteDisponible: { type: Number, required: true },
  type: { type: String, required: true }, 
});

export default mongoose.model<BilletDocument>("Billet", billetSchema);
