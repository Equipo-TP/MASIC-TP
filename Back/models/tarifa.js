'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TarifaSchema = Schema({
    ID_tarifa: { type: Number, required: true, unique: true },
    Tipo_Luminaria: { type: String, required: true },
    Descripcion: { type: String, required: true },
    Precio: { type: Number, required: true }
});

module.exports = mongoose.model('tarifa', TarifaSchema);
