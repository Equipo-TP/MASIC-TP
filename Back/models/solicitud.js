'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SolicitudSchema = Schema({
 vendedor: {type: Schema.ObjectId, ref: 'usuario', required: true},
 cliente: {type: Schema.ObjectId, ref:'cliente', required: true},
 caracteristicas_obra: {type: String, required: true},
 descripcion_servicio: {type: String, required: true},
 observaciones: {type: String, default: 'No hay observaciones', required: false},
 estado_1: {type: String, default: 'Enviado', required: true},
 estado_2: {type: String, default: 'Pendiente', required: true},
 presupuesto: {type: Schema.ObjectId, ref: 'presupuesto', required: false},
 createdAt: {type: Date, default: Date.now, required: true}
});

module.exports = mongoose.model('solicitud', SolicitudSchema );