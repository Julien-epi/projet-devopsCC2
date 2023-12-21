"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const billetModel_1 = __importDefault(require("../models/billetModel"));
const billetSelled_1 = __importDefault(require("../models/billetSelled"));
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
class BilletterieService {
    createBilletType(billetTypeInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Début de la création d'un type de billet");
            const eventResponse = yield axios_1.default.get(`${process.env.API_EVENT_URL}/${billetTypeInfo.eventId}`);
            const event = eventResponse.data;
            console.log("Détails de l'événement récupérés:", event);
            if (!event) {
                throw new Error("Événement non trouvé.");
            }
            const capaciteEvenement = event.capacity;
            console.log("Capacité de l'événement:", capaciteEvenement);
            const totalBilletsExistant = yield billetModel_1.default.aggregate([
                { $match: { eventId: billetTypeInfo.eventId } },
                { $group: { _id: null, total: { $sum: "$quantiteDisponible" } } }
            ]);
            const totalBilletsExistantNum = totalBilletsExistant.length > 0 ? totalBilletsExistant[0].total : 0;
            console.log("Total des billets existants pour l'événement:", totalBilletsExistantNum);
            const totalApresAjout = totalBilletsExistantNum + billetTypeInfo.quantiteDisponible;
            console.log("Total après ajout de nouveaux billets:", totalApresAjout);
            if (totalApresAjout > capaciteEvenement) {
                throw new Error("La création de ces billets dépasse la capacité totale de l'événement.");
            }
            const newBilletType = new billetModel_1.default(billetTypeInfo);
            const billetCree = yield newBilletType.save();
            console.log("Nouveau type de billet créé:", billetCree);
            return billetCree;
        });
    }
    getEventDetails(eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(`${process.env.API_EVENT_URL}/${eventId}`);
                return response.data;
            }
            catch (error) {
                console.error("Erreur lors de la récupération des détails de l'événement", error);
                throw error;
            }
        });
    }
    buyBillet(userId, eventId, billetTypeId, quantite, stripeToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${process.env.API_EVENT_URL}/${eventId}`);
            const eventDetails = response.data;
            if (!eventDetails || eventDetails.isCanceled) {
                throw new Error("L'événement n'est pas disponible.");
            }
            const billetType = yield billetModel_1.default.findOne({
                _id: billetTypeId,
                eventId: eventId,
            });
            if (!billetType || billetType.quantiteDisponible < quantite) {
                throw new Error("Type de billet non disponible ou quantité insuffisante.");
            }
            const prixTotal = billetType.prix * quantite;
            let charge;
            try {
                charge = yield stripe.charges.create({
                    amount: prixTotal * 100,
                    currency: "eur",
                    source: stripeToken,
                    description: `Achat de billets pour l'événement ${eventId}`,
                });
                if (charge.status !== "succeeded") {
                    throw new Error("Le paiement a échoué.");
                }
            }
            catch (error) {
                console.error("Erreur lors du paiement Stripe", error);
                throw error;
            }
            billetType.quantiteDisponible -= quantite;
            yield billetType.save();
            for (let i = 0; i < quantite; i++) {
                const billetVendu = new billetSelled_1.default({
                    userId,
                    billetId: billetType._id,
                    eventId,
                    quantite: 1,
                });
                yield billetVendu.save();
            }
            return {
                message: "Achat de billet réussi",
                userId: userId,
                eventId: eventId,
                quantiteAchetee: quantite,
                stripeChargeId: charge.id,
            };
        });
    }
}
exports.default = new BilletterieService();
