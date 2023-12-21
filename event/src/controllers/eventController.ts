import { Request, Response } from "express";
import EventService from "../services/eventService";

class EventController {
  public getAllEvents = async (req: Request, res: Response): Promise<void> => {
    try {
      const filters = req.query;
      const events = await EventService.findEventsWithFilters(filters);
      res.json(events);
    } catch (err: any) {
      res.status(500).send(err.message);
    }
  };

  public createEvent = async (req: Request, res: Response): Promise<void> => {
    try {
      const event = await EventService.createEvent(req.body);
      console.log("Event created:", event);
      res.status(200).json(event);
    } catch (err: any) {
      console.error("Error creating event:", err);
      res.status(400).send(err.message);
    }
  };

  public async updateEvent(req: Request, res: Response): Promise<void> {
    try {
      const event = await EventService.updateEvent(req.params.id, req.body);
      if (!event) {
        res.status(404).json({ error: "Invalid event ID" });
        return;
      }
      res.status(200).json(event);
    } catch (err: any) {
      res.status(500).send(err.message);
    }
  }

  public async deleteEvent(req: Request, res: Response): Promise<void> {
    try {
      await EventService.deleteEvent(req.params.id);
      res.status(204).send();
    } catch (err: any) {
      res.status(500).send(err.message);
    }
  }

  public async getEventById(req: Request, res: Response): Promise<void> {
    try {
      const eventId = req.params.id;
      const event = await EventService.findEventById(eventId);
      if (event) {
        res.json(event);
      } else {
        res.status(404).send("Événement non trouvé");
      }
    } catch (err: any) {
      res.status(500).send(err.message);
    }
  }
}

export default new EventController();
