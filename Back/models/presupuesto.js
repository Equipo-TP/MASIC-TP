'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PresupuestoSchema = Schema({
  ID_Presupuesto: { type: Number, required: false },
  ID_Solicitud_Presupuesto: { type: Schema.ObjectId, ref: 'solicitud', required: true, unique: true },
  IGV: { type: Number, required: false }, 
  Tiempo: { type: Date, required: false},
  Transporte_Personal: { type: String, required: true },
  instalaciones: [
    {
        tipo_luminaria: {type: Schema.ObjectId, ref: 'instalaciones', required: true}, // Referencia a otra tabla de luminarias
        cantidad: {type: Number, required: true}, // Cantidad de cada tipo de luminaria
        costo_total: {type: Number, required: false} //precio x cantidad
    }
  ],
  Materiales: { type: String, required: true },
  Costo_Materiales: { type: Number, required: true },
  Costo_Transporte: { type: Number, required: true },
  Sub_Neto: {type: Number, required: false}, 
  Pago_Total: { type: Number, required: false }, 
  createdAt: { type: Date, default: Date.now, required: true }
});
module.exports = mongoose.model('presupuesto', PresupuestoSchema);

