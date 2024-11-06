'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MaterialSchema = Schema({
    nombre: { type: String, required: true }, 
    categoria: { type: String, required: true }, 
    stock: { type: Number, required: true, default: 0 },
    fecha_registro: { type: Date, default: Date.now },
    unidad_medida: { type: String, required: true },
});

module.exports = mongoose.model('Material', MaterialSchema );