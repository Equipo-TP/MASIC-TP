'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PresupuestoSchema = Schema({
  ID_Presupuesto: { type: Number, required: true },
  ID_Solicitud_Presupuesto: { type: Schema.ObjectId, ref: 'solicitud', required: true, unique: true },
  IGV: { type: Number, required: false, default: 18 }, 
  Tiempo: { type: Date, required: false},
  Transporte_Personal: { type: String, required: true },
  Materiales: { type: String, required: true },
  Costo_Materiales: { type: Number, required: true },
  Costo_Transporte: { type: Number, required: true }, 
  Costo_Total: { type: Number, required: true }, 
  createdAt: { type: Date, default: Date.now, required: true }
});

PresupuestoSchema.pre('save', function(next) {
  this.Costo_Total = this.Costo_Transporte + this.Costo_Materiales;
  next();
});

module.exports = mongoose.model('presupuesto', PresupuestoSchema);

