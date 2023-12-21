import mongoose, { Schema } from "mongoose";

const billetVenduSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  billetId: { type: Schema.Types.ObjectId, ref: 'Billet', required: true },
  eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  quantite: { type: Number, required: true },
  dateAchat: { type: Date, default: Date.now }
});

export default mongoose.model("BilletVendu", billetVenduSchema);
