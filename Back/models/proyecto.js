'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProyectoSchema = Schema({
  ID_Proyecto: { type: Number, required: false },
  ID_Presupuesto_Proyecto: { type: Schema.ObjectId, ref: 'presupuesto', required: true, unique: true },
  Costo_Total: { type: Number, required: false }, 
  horario: [ //recurso react para cronograma (react-big-calendar)
    {       
        Tecnico: [{  type: Schema.ObjectId, ref: 'usuario', required: false, unique: true }],
        fecha_inicio: {type: Date, required: false},
        fecha_final: {type: Date, required: false},
        Hora_Inicio: { type: String, required: false },
        Hora_Fin: { type: String, required: false }
    }
  ],
  Nombre_Proyecto: { type: String, required: true },
  Descripcion: { type: String, required: true },
  Estado: {type: String, default: 'Por realizar', required: false},
  Observacion: { type: String, required: false },//no es la de la solicitud, que notifique cuando no esta puesto el horario/tecnico
  Incidencias: [//aun no esta en el back
    {
        afectado: {type: Schema.ObjectId, ref: 'usuario', required: false}, 
        descripcion: {type: String, required: false}, 
        fecha: {type: Date, required: false} 
    }
  ],
  createdAt: { type: Date, default: Date.now, required: true }
});
module.exports = mongoose.model('proyecto', ProyectoSchema);
