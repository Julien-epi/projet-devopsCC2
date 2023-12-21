
import * as express from "express";
import { Router } from "express";
import billetController from "../controllers/billetController";

class BilletRoutes {
    public router: Router;

    constructor() {
      this.router = express.Router();
      this.routes();
    }

    public routes(): void {
      /**
       * @swagger
       * /billet/type:
       *   post:
       *     summary: Crée un nouveau type de billet
       *     tags: [Billets]
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             type: object
       *             required:
       *               - eventId
       *               - nom
       *               - prix
       *               - quantiteDisponible
       *               - type
       *             properties:
       *               eventId:
       *                 type: string
       *                 description: ID de l'événement associé
       *               nom:
       *                 type: string
       *                 description: Nom du type de billet
       *               prix:
       *                 type: number
       *                 description: Prix du billet
       *               quantiteDisponible:
       *                 type: number
       *                 description: Quantité de billets disponibles
       *               type:
       *                 type: string
       *                 description: Catégorie du billet (ex. Standard, VIP)
       *     responses:
       *       200:
       *         description: Type de billet créé avec succès
       *       400:
       *         description: Données d'entrée invalides
       */

      this.router.post("/type", billetController.createBilletType);

      /**
       * @swagger
       * /billet/buy:
       *   post:
       *     summary: Achète un billet
       *     tags: [Billets]
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             type: object
       *             required:
       *               - userId
       *               - eventId
       *               - billetTypeId
       *               - quantite
       *               - stripeToken
       *             properties:
       *               userId:
       *                 type: string
       *                 description: ID de l'utilisateur acheteur
       *               eventId:
       *                 type: string
       *                 description: ID de l'événement pour lequel le billet est acheté
       *               billetTypeId:
       *                 type: string
       *                 description: ID du type de billet acheté
       *               quantite:
       *                 type: number
       *                 description: Quantité de billets achetés
       *               stripeToken:
       *                 type: string
       *                 description: Token Stripe pour le paiement
       *     responses:
       *       200:
       *         description: Billet acheté avec succès
       *       400:
       *         description: Données d'entrée invalides ou problème de paiement
       */

      this.router.post("/buy", billetController.buyBillet);
    }
}

export default new BilletRoutes().router;
