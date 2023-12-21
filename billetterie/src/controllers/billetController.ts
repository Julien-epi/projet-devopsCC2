import { Request, Response } from "express";
import BilletterieService from "../services/billetService";

class BilletterieController {
  public async createBilletType(req: Request, res: Response): Promise<void> {
    try {
      const billetType = await BilletterieService.createBilletType(req.body);
      res.json(billetType);
    } catch (error: any) {
      res.status(500).send(error.message);
    } 
  }

  public async buyBillet(req: Request, res: Response): Promise<void> {
    try {
      const { userId, eventId, billetTypeId, quantite, stripeToken } = req.body;
      const achat = await BilletterieService.buyBillet(userId, eventId, billetTypeId, quantite, stripeToken);
      res.json(achat);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }
}

export default new BilletterieController();
