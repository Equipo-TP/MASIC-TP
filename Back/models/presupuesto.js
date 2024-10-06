'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PresupuestoSchema = Schema({
 solicitud: {type: Schema.ObjectId, ref: 'solicitud', required: true},
 id: {type: Number, required: true},
 estado_1: {type: String, default: 'Enviado', required: false},
 estado_2: {type: String, default: 'Pendiente', required: false},
 costo_transporte: {type: Number, required: true},
 createdAt: {type: Date, default: Date.now, required: true}
});

module.exports = mongoose.model('presupuesto', PresupuestoSchema ); 