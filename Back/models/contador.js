'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ContadorSchema = Schema({
    nombre: { type: String, required: true, unique: true },
    valor: { type: Number, required: true, default: 0 }
});

module.exports = mongoose.model('contador', ContadorSchema);
