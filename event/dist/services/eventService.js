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
const eventModel_1 = __importDefault(require("../models/eventModel"));
const node_geocoder_1 = __importDefault(require("node-geocoder"));
const geocoderOptions = {
    provider: 'openstreetmap',
};
const geo = (0, node_geocoder_1.default)(geocoderOptions);
class EventService {
    findAllEvents() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield eventModel_1.default.find();
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Error fetching events: ${error.message}`);
                }
                else {
                    throw new Error('Unknown error occurred while fetching events');
                }
            }
        });
    }
    findEventsWithFilters(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {};
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
            return yield eventModel_1.default.find(query);
        });
    }
    createEvent(eventData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const geocodeResults = yield geo.geocode(eventData.location);
                if (geocodeResults.length === 0) {
                    throw new Error('Address not found');
                }
                const { latitude, longitude } = geocodeResults[0];
                const newEvent = new eventModel_1.default(Object.assign(Object.assign({}, eventData), { latitude,
                    longitude }));
                return yield newEvent.save();
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Error creating event: ${error.message}`);
                }
                else {
                    throw new Error('Unknown error occurred while creating event');
                }
            }
        });
    }
    updateEvent(eventId, eventData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield eventModel_1.default.findByIdAndUpdate(eventId, eventData, { new: true });
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Error updating event: ${error.message}`);
                }
                else {
                    throw new Error('Unknown error occurred while updating event');
                }
            }
        });
    }
    deleteEvent(eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield eventModel_1.default.findByIdAndDelete(eventId);
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Error deleting event: ${error.message}`);
                }
                else {
                    throw new Error('Unknown error occurred while deleting event');
                }
            }
        });
    }
    findEventById(eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield eventModel_1.default.findById(eventId);
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Erreur lors de la récupération de l'événement : ${error.message}`);
                }
                else {
                    throw new Error("Une erreur inconnue est survenue lors de la récupération de l'événement");
                }
            }
        });
    }
}
exports.default = new EventService();
