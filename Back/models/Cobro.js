'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CobroSchema = Schema({
    vendedora: { type: String, required: true },
    cliente: { type: String, required: true },
    servicio: { type: String, required: true },
    id: { type: String, unique: true, required: true },
    totalCobrado: { type: Number, required: true },
    saldoRestante: { type: Number, required: true },
    estado: { type: String, enum: ['Cobrado Completamente', 'Por Cobrar', 'Saldo Parcial'], required: true },
    pagos: [
        {
            monto: { type: Number },
            porcentaje: { type: Number },
            fecha: { type: Date },
            observaciones: { type: String },
        }
    ],
    fecha_registro: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cobro', CobroSchema);
