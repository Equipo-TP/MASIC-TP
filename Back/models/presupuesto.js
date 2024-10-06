'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PresupuestoSchema = Schema({
  ID_Presupuesto: { type: Number, required: true },
  ID_Solicitud_Presupuesto: { type: Schema.ObjectId, ref: 'solicitud', required: true, unique: true }, // Solo un presupuesto por solicitud
  IGV: { type: Number, required: true }, // FLOAT, usando Number en Mongoose
  Tiempo: { type: Date, required: true },
  Transporte_Personal: { type: String, required: true },
  Materiales: { type: String, required: true },
  Costo_Materiales: { type: Number, required: true }, // FLOAT, usando Number en Mongoose
  createdAt: { type: Date, default: Date.now, required: true }
});

module.exports = mongoose.model('presupuesto', PresupuestoSchema);
