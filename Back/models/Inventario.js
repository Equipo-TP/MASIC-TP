'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InventarioSchema = new Schema({
    _id: { type: Schema.ObjectId, ref: 'Material', required: true },
    cantidad: { type: Number, required: true },
    fecha_mov: { type: Date, required: true }
});

module.exports = mongoose.model('Inventario', InventarioSchema);
