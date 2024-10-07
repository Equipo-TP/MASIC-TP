'use strict'


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PresupuestoTarifaSchema = Schema({
  ID_tarifa: { type: Schema.ObjectId, ref: 'instalacion', required: true },
  Cantidad: { type: Number, required: true },
  Costo_Total: { type: Number, required: false }
});
module.exports = mongoose.model('presupuesto_tarifa', PresupuestoTarifaSchema);

