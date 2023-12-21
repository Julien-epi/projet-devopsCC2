"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
const handleError = (error, res, customMessage) => {
    if (error instanceof Error) {
        const message = customMessage || error.message;
        return res.status(500).json({ error: message });
    }
    return res.status(500).json({ error: 'An unknown error occurred' });
};
exports.handleError = handleError;
