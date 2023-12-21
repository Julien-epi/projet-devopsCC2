import mongoose from 'mongoose';

export default interface IBillet {
  eventId: mongoose.Types.ObjectId;
  nom: string;
  type: string;
  prix: number;
  quantiteDisponible: number;
}
