'use strict';

var PresupuestoTarifa = require('../models/presupuesto_tarifa');
var Instalacion = require('../models/instalacion');  


const registrar_presupuesto_tarifa = async function(req, res) {
  try {
    var data = req.body;

 
    var instalacion = await Instalacion.findById(data.ID_instalacion); 
    if (!instalacion) {
      return res.status(404).send({ message: 'Instalación no encontrada' });
    }

  
    var presupuesto_tarifa = await PresupuestoTarifa.create({
      ID_Presupuesto: data.ID_Presupuesto,
      ID_tarifa: instalacion._id, 
      Cantidad: data.Cantidad,
      Costo_Total: data.Costo_Total
    });

    res.status(200).send({ data: presupuesto_tarifa });
  } catch (error) {
    res.status(500).send({ message: 'Error al registrar el Presupuesto_Tarifa', error });
  }
};


const listar_presupuestos_tarifa_por_presupuesto = async function(req, res) {
  try {
    var id_presupuesto = req.params['id'];
    var registros = await PresupuestoTarifa.find({ ID_Presupuesto: id_presupuesto }).populate('ID_tarifa');
    res.status(200).send({ data: registros });
  } catch (error) {
    res.status(500).send({ message: 'Error al listar Presupuestos_Tarifa por presupuesto', error });
  }
};


const listar_presupuestos_tarifa_por_instalacion = async function(req, res) {
  try {
    var id_instalacion = req.params['id'];
    var registros = await PresupuestoTarifa.find({ ID_tarifa: id_instalacion }).populate('ID_Presupuesto');
    res.status(200).send({ data: registros });
  } catch (error) {
    res.status(500).send({ message: 'Error al listar Presupuestos_Tarifa por instalación', error });
  }
};


const editar_presupuesto_tarifa = async function(req, res) {
  try {
    var id = req.params['id'];
    var data = req.body;

    
    var instalacion = await Instalacion.findById(data.ID_instalacion);
    if (!instalacion) {
      return res.status(404).send({ message: 'Instalación no encontrada' });
    }

  
    var updatedRecord = await PresupuestoTarifa.findByIdAndUpdate(id, {
      ID_Presupuesto: data.ID_Presupuesto,
      ID_tarifa: instalacion._id,  // Usar _id de instalación
      Cantidad: data.Cantidad,
      Costo_Total: data.Costo_Total
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

module.exports = {
  registrar_presupuesto_tarifa,
  listar_presupuestos_tarifa_por_presupuesto,
  listar_presupuestos_tarifa_por_instalacion,  
  editar_presupuesto_tarifa, 
};
