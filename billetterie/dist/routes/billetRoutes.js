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
const billetController_1 = __importDefault(require("../controllers/billetController"));
class BilletRoutes {
    constructor() {
        this.router = express.Router();
        this.routes();
    }
    routes() {
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
        this.router.post("/type", billetController_1.default.createBilletType);
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
        this.router.post("/buy", billetController_1.default.buyBillet);
    }
}
exports.default = new BilletRoutes().router;
