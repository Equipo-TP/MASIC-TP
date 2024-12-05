'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InventarioSchema = new Schema({
    id_material: { type: Schema.ObjectId, ref: 'Material', required: true },
    tipo_movimiento: { type: String,  default: 'Entrada', required: false }, // Identificar si es entrada/ingreso
    cantidad: { type: Number, required: true },
    descripcion: { type: String, required: false }, // Descripción del motivo de ingreso
    fecha_mov: { type: Date, required: true },
    tipo_ingreso: { type: String, enum: ['Compra', 'Sobrantes'], required: false }, // Motivo de ingreso
    proyecto: { type: Schema.ObjectId, ref: 'Proyecto', required: false }

});

module.exports = mongoose.model('Inventario', InventarioSchema);