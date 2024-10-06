'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PresupuestoTarifaSchema = Schema({
    tarifa: {type: Schema.ObjectId, ref: 'instalacion', required: false},
    cantidad: {type: Number, required: true},
    costo_total: {type: Number, required: true},
});

module.exports = mongoose.model('PresupuestoTarifa', PresupuestoTarifaSchema);