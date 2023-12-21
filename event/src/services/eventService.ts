import IEvent from "../interfaces/IEvent";
import EventModel from "../models/eventModel";
import geocoder from 'node-geocoder';

const geocoderOptions: geocoder.Options = {
  provider: 'openstreetmap', 
};

const geo = geocoder(geocoderOptions);

class EventService {
  public async findAllEvents(): Promise<IEvent[]> {
    try {
      return await EventModel.find();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error fetching events: ${error.message}`);
      } else {
        throw new Error('Unknown error occurred while fetching events');
      }
    }
  }

  public async findEventsWithFilters(filters: any): Promise<IEvent[]> {
    const query: any = {};
    if (filters.title) {
      query.title = new RegExp(filters.title, 'i'); // i = case insensitive
    }
    if (filters.location) {
      query.location = filters.location;
    }
    if (filters.date) {
      query.date = filters.date;
    }
    if (filters.category) {
      query.category = filters.category;
    }
    return await EventModel.find(query);
  }

  public async createEvent(eventData: IEvent): Promise<IEvent> {
    try {
      const geocodeResults = await geo.geocode(eventData.location);
      if (geocodeResults.length === 0) {
        throw new Error('Address not found');
      }
      const { latitude, longitude } = geocodeResults[0];

      const newEvent = new EventModel({
        ...eventData,
        latitude,
        longitude,
      });
      return await newEvent.save();
      
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error creating event: ${error.message}`);
      } else {
        throw new Error('Unknown error occurred while creating event');
      }
    }
  }


  public async updateEvent(eventId: string, eventData: IEvent): Promise<IEvent | null> {
    try {
      return await EventModel.findByIdAndUpdate(eventId, eventData, { new: true });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error updating event: ${error.message}`);
      } else {
        throw new Error('Unknown error occurred while updating event');
      }
    }
  }

  public async deleteEvent(eventId: string): Promise<void> {
    try {
      await EventModel.findByIdAndDelete(eventId);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error deleting event: ${error.message}`);
      } else {
        throw new Error('Unknown error occurred while deleting event');
      }
    }
  }

  public async findEventById(eventId: string): Promise<IEvent | null> {
    try {
      return await EventModel.findById(eventId);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Erreur lors de la récupération de l'événement : ${error.message}`);
      } else {
        throw new Error("Une erreur inconnue est survenue lors de la récupération de l'événement");
      }
    }
  } 
}

export default new EventService();
