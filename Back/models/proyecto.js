'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProyectoSchema = Schema({
  ID_Proyecto: { type: Number, required: false },
  ID_Presupuesto_Proyecto: { type: Schema.ObjectId, ref: 'presupuesto', required: false, unique: true },
  Costo_Total: { type: Number, required: false }, 
  Horario: [ //recurso react para cronograma (react-big-calendar)
    {       
        Tecnico: [{  type: Schema.ObjectId, ref: 'usuario'}],
        fecha_inicio: {type: Date, required: false},
        fecha_final: {type: Date, required: false},
    }
  ],
  GestionarMaterial: [ 
    {       
        id_Material: {type: Schema.ObjectId, ref: 'Material', required: false},
        Cantidad: {type: Number, required: false}
    }
  ],
  Nombre_Proyecto: { type: String, required: true },
  Descripcion: { type: String, required: true },
  Estado: {type: String, default: 'Por realizar', required: false},
  Observacion: { type: String, required: false },//no es la de la solicitud, que notifique cuando no esta puesto el horario/tecnico
  Incidencias: [
    {
        afectado: {type: Schema.ObjectId, ref: 'usuario', required: false}, 
        descripcion: {type: String, required: false}, 
        fecha: {type: Date, required: false} 
    }
  ],
  totalCobrado: { type: Number, required: false },
  saldoRestante: { type: Number, required: false },
  estadodeCobro: { type: String, enum: ['Cobrado Completamente', 'Por Cobrar', 'Saldo Parcial'], required: false },
    pagos: [
        {
            monto: { type: Number },
            porcentaje: {
              type: Number,
              required: false,
              default: function () {
                return this.Costo_Total - this.totalCobrado;
              },
            },
            fecha: { type: Date },
            observaciones: { type: String },
        }
    ],
  createdAt: { type: Date, default: Date.now, required: true }
});
module.exports = mongoose.model('proyecto', ProyectoSchema);
