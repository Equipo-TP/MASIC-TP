'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ClienteSchema = Schema({
    nombre: {type: String, required: true},
    apellidos: {type: String, required: false},
    tipo:{type:String, required: true},
    RUC: {type: Number, required: false},
    email: {type: String, required: true},
    telefono: {type: String, required: true},
    createdAt: {type: Date, default: Date.now, required: true}
});

module.exports = mongoose.model('cliente', ClienteSchema );