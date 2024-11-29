'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InventarioSchema = new Schema({
    id_material: { type: Schema.ObjectId, ref: 'Material', required: true },
    tipo_movimiento: { type: String, enum: ['Ingreso', 'Egreso'], required: true }, // Identificar si es ingreso o egreso
    cantidad: { type: Number, required: true },
    descripcion: { type: String, required: false }, // Descripción del movimiento
    fecha_mov: { type: Date, required: true },
    motivo: { type: String, enum: ['Compra', 'Sobrantes'], required: true }, // Motivo de ingreso
});

module.exports = mongoose.model('Inventario', InventarioSchema);
