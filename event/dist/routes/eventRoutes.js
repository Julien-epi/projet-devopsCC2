"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const eventController_1 = __importDefault(require("../controllers/eventController"));
class EventRoutes {
    constructor() {
        this.router = express.Router();
        this.routes();
    }
    routes() {
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
        this.router.get("/", eventController_1.default.getAllEvents);
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
        this.router.post("/registerEvent", eventController_1.default.createEvent);
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
        this.router.put("/:id", eventController_1.default.updateEvent);
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
        this.router.delete("/:id", eventController_1.default.deleteEvent);
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
        this.router.get("/:id", eventController_1.default.getEventById);
    }
}
exports.default = new EventRoutes().router;
