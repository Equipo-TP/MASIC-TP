'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MaterialSchema = Schema({
    nombre: { type: String, required: true }, 
    categoria: { type: String, required: false },
    stock: { type: Number, required: true, default: 0 }, // Stock total
    stock_fisico: { type: Number, required: true, default: 0 }, // Stock físico en almacén
    fecha_registro: { type: Date, default: Date.now },
    unidad_medida: { type: String, required: true },
    descripcion: { type: String, required: false } // Descripción para el material
});

MaterialSchema.methods.toJSON = function() {
    const obj = this.toObject();

    // Convert fecha_registro
    if (obj.fecha_registro) {
      obj.fecha_registro = obj.fecha_registro.toLocaleString();
    }
    return obj;
  };

module.exports = mongoose.model('Material', MaterialSchema );