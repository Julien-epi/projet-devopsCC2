import * as express from "express";
import { Router } from "express";
import eventController from "../controllers/eventController";

class EventRoutes {
  public router: Router;

  constructor() {
    this.router = express.Router();
    this.routes();
  }

  public routes(): void {
    /**
     * @swagger
     * /events:
     *   get:
     *     summary: Récupère la liste de tous les événements
     *     tags: [Événements]
     *     responses:
     *       200:
     *         description: Liste des événements
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Event'
     */
    this.router.get("/", eventController.getAllEvents);

    /**
     * @swagger
     * /events/registerEvent:
     *   post:
     *     summary: Crée un nouvel événement
     *     tags: [Événements]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Event'
     *     responses:
     *       200:
     *         description: L'événement a été créé avec succès
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Event'
     */
    this.router.post("/registerEvent", eventController.createEvent);

    /**
     * @swagger
     * /events/{id}:
     *   put:
     *     summary: Met à jour un événement
     *     tags: [Événements]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: ID de l'événement
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Event'
     *     responses:
     *       200:
     *         description: L'événement a été mis à jour
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Event'
     */
    this.router.put("/:id", eventController.updateEvent);

    /**
     * @swagger
     * /events/{id}:
     *   delete:
     *     summary: Supprime un événement
     *     tags: [Événements]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: ID de l'événement
     *     responses:
     *       204:
     *         description: L'événement a été supprimé
     */
    this.router.delete("/:id", eventController.deleteEvent);

    /**
     * @swagger
     * /events/{id}:
     *   get:
     *     summary: Récupère un événement spécifique par ID
     *     tags: [Événements]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: ID de l'événement
     *     responses:
     *       200:
     *         description: Détails de l'événement
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Event'
     */
    this.router.get("/:id", eventController.getEventById);
  }
}

export default new EventRoutes().router;
