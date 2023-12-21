import axios from "axios";
import IBillet from "../interfaces/IBillet";
import billetSchema from "../models/billetModel";
import BilletVenduModel from "../models/billetSelled";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

class BilletterieService {
  public async createBilletType(billetTypeInfo: IBillet) {
    console.log("Début de la création d'un type de billet");

    const eventResponse = await axios.get(`${process.env.API_EVENT_URL}/${billetTypeInfo.eventId}`);
    const event = eventResponse.data;

    console.log("Détails de l'événement récupérés:", event);

    if (!event) {
      throw new Error("Événement non trouvé.");
    }
    const capaciteEvenement = event.capacity;
    console.log("Capacité de l'événement:", capaciteEvenement);

    const totalBilletsExistant = await billetSchema.aggregate([
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

    const newBilletType = new billetSchema(billetTypeInfo);
    const billetCree = await newBilletType.save();
    console.log("Nouveau type de billet créé:", billetCree);

    return billetCree;
  }

  public async getEventDetails(eventId: string) {
    try {
      const response = await axios.get(
        `${process.env.API_EVENT_URL}/${eventId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des détails de l'événement",
        error
      );
      throw error;
    }
  }

  public async buyBillet(
    userId: string,
    eventId: string,
    billetTypeId: string,
    quantite: number,
    stripeToken: string
  ) {
    const response = await axios.get(`${process.env.API_EVENT_URL}/${eventId}`);
    const eventDetails = response.data;

    if (!eventDetails || eventDetails.isCanceled) {
      throw new Error("L'événement n'est pas disponible.");
    }

    const billetType = await billetSchema.findOne({
      _id: billetTypeId,
      eventId: eventId,
    });
    if (!billetType || billetType.quantiteDisponible < quantite) {
      throw new Error(
        "Type de billet non disponible ou quantité insuffisante."
      );
    }

    const prixTotal = billetType.prix * quantite;

    let charge;
    try {
      charge = await stripe.charges.create({
        amount: prixTotal * 100,
        currency: "eur",
        source: stripeToken,
        description: `Achat de billets pour l'événement ${eventId}`,
      });

      if (charge.status !== "succeeded") {
        throw new Error("Le paiement a échoué.");
      }
    } catch (error) {
      console.error("Erreur lors du paiement Stripe", error);
      throw error;
    }

    billetType.quantiteDisponible -= quantite;
    await billetType.save();

    for (let i = 0; i < quantite; i++) {
      const billetVendu = new BilletVenduModel({
        userId,
        billetId: billetType._id,
        eventId,
        quantite: 1,
      });
      await billetVendu.save();
    }

    return {
      message: "Achat de billet réussi",
      userId: userId,
      eventId: eventId,
      quantiteAchetee: quantite,
      stripeChargeId: charge.id,
    };
  }
}

export default new BilletterieService();
