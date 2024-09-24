'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InstalacionSchema = Schema({
    tipo_luminaria: {type: String, required: true},
    descripcion: {type: String, required: true},
    precio: {type: Number, required: true}
});

module.exports = mongoose.model('instalacion', InstalacionSchema );