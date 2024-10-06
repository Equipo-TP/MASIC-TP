'use strict';

var PresupuestoTarifa = require('../models/presupuesto_tarifa');

const registrar_presupuesto_tarifa = async function(req, res) {
  try {
    var data = req.body;
    var presupuesto_tarifa = await PresupuestoTarifa.create(data);
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

const listar_presupuestos_tarifa_por_tarifa = async function(req, res) {
  try {
    var id_tarifa = req.params['id'];
    var registros = await PresupuestoTarifa.find({ ID_tarifa: id_tarifa }).populate('ID_Presupuesto');
    res.status(200).send({ data: registros });
  } catch (error) {
    res.status(500).send({ message: 'Error al listar Presupuestos_Tarifa por tarifa', error });
  }
};

const editar_presupuesto_tarifa = async function(req, res) {
  try {
    var id = req.params['id'];
    var data = req.body;

    // Actualiza el registro de Presupuesto_Tarifa
    var updatedRecord = await PresupuestoTarifa.findByIdAndUpdate(id, {
      ID_Presupuesto: data.ID_Presupuesto,
      ID_tarifa: data.ID_tarifa,
      Cantidad: data.Cantidad,
      Costo_Total: data.Costo_Total
    }, { new: true }); // new: true devuelve el documento actualizado

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
  listar_presupuestos_tarifa_por_tarifa,
  editar_presupuesto_tarifa, 
};
