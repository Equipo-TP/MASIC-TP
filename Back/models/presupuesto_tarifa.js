'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PresupuestoTarifaSchema = Schema({
  ID_Presupuesto: { type: Schema.ObjectId, ref: 'presupuesto', required: true },
  ID_tarifa: { type: Schema.ObjectId, ref: 'tarifa', required: true },
  Cantidad: { type: Number, required: true },
  Costo_Total: { type: Number, required: true }
});

module.exports = mongoose.model('presupuesto_tarifa', PresupuestoTarifaSchema);
