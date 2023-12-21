export default interface IEvent {
  title: string;
  description: string;
  location: string;
  date: Date;
  capacity: number; // nombre total de places disponibles
  venue: string; // lieu précis de l'événement (salle, etc.)
  categories: string[]; // catégories pour l'événement
  tags: string[]; // tags pour filtrer
  imageUrl: string; // image de l'événement
  isCanceled: boolean; // si l'événement est annulé
  createdAt?: Date; 
  updatedAt?: Date; 
  latitude?: number;
  longitude?: number;
}
