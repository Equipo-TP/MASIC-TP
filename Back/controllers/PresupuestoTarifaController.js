'use strict';

var PresupuestoTarifa = require('../models/presupuesto_tarifa');
var Instalacion = require('../models/instalacion');

// Registrar Presupuesto_Tarifa
const registrar_presupuesto_tarifa = async function(req, res) {
  try {
    var data = req.body;

 
    var instalacion = await Instalacion.findById(data.ID_instalacion);
    if (!instalacion) {
      return res.status(404).send({ message: 'Instalación no encontrada' });
    }

 
    var costoTotal = data.Cantidad * instalacion.Precio;

 
    var presupuesto_tarifa = await PresupuestoTarifa.create({
      ID_tarifa: instalacion._id,  
      Cantidad: data.Cantidad,
      Costo_Total: costoTotal 
    });

    res.status(200).send({ data: presupuesto_tarifa });
  } catch (error) {
    res.status(500).send({ message: 'Error al registrar el Presupuesto_Tarifa', error });
  }
};

// Listar Presupuestos_Tarifa por tarifa (instalación)
const listar_presupuestos_tarifa_por_instalacion = async function(req, res) {
  try {
    var id_instalacion = req.params['id'];
    var registros = await PresupuestoTarifa.find({ ID_tarifa: id_instalacion }).populate('ID_tarifa');
    res.status(200).send({ data: registros });
  } catch (error) {
    res.status(500).send({ message: 'Error al listar Presupuestos_Tarifa por instalación', error });
  }
};

// Editar Presupuesto_Tarifa
const editar_presupuesto_tarifa = async function(req, res) {
  try {
    var id = req.params['id'];
    var data = req.body;

    // Buscar la instalación (que actúa como tarifa)
    var instalacion = await Instalacion.findById(data.ID_instalacion);
    if (!instalacion) {
      return res.status(404).send({ message: 'Instalación no encontrada' });
    }


    var costoTotal = data.Cantidad * instalacion.Precio;

    var updatedRecord = await PresupuestoTarifa.findByIdAndUpdate(id, {
      ID_tarifa: instalacion._id,  
      Cantidad: data.Cantidad,
      Costo_Total: costoTotal 
    }, { new: true });

    if (updatedRecord) {
      res.status(200).send({ data: updatedRecord });
    } else {
      res.status(404).send({ message: 'Presupuesto_Tarifa no encontrado' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Error al editar el Presupuesto_Tarifa', error });
  }
};
const eliminar_presupuesto_tarifa = async function(req, res) {
  try {
    var id = req.params['id'];
    
    var presupuestoTarifa = await PresupuestoTarifa.findByIdAndDelete(id);
    
    if (!presupuestoTarifa) {
      return res.status(404).send({ message: 'Presupuesto_Tarifa no encontrado' });
    }
    
    res.status(200).send({ message: 'Presupuesto_Tarifa eliminado con éxito' });
  } catch (error) {
    res.status(500).send({ message: 'Error al eliminar el Presupuesto_Tarifa', error });
  }
};
module.exports = {
  registrar_presupuesto_tarifa,
  listar_presupuestos_tarifa_por_instalacion,
  editar_presupuesto_tarifa,
  eliminar_presupuesto_tarifa,
};
