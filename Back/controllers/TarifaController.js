'use strict';

var Tarifa = require('../models/tarifa');

// Registrar tarifa
const registro_tarifa = async function(req, res) {
    var data = req.body;
    try {
        var reg = await Tarifa.create(data);
        res.status(200).send({ data: reg });
    } catch (error) {
        res.status(500).send({ message: 'Error al registrar tarifa', error });
    }
};

// Listar tarifas
const listar_tarifas = async function(req, res) {
    try {
        var reg = await Tarifa.find({});
        res.status(200).send({ data: reg });
    } catch (error) {
        res.status(500).send({ message: 'Error al listar tarifas', error });
    }
};

// Obtener tarifa por ID
const obtener_tarifa_por_id = async function(req, res) {
    const id = req.params['id'];
    try {
        let tarifa = await Tarifa.findById(id);
        if (tarifa) {
            res.status(200).send({ data: tarifa });
        } else {
            res.status(404).send({ message: 'Tarifa no encontrada' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error al obtener la tarifa', error });
    }
};

// Editar tarifa
const editar_tarifa = async function(req, res) {
    const id = req.params['id'];
    var data = req.body;
    try {
        var reg = await Tarifa.findByIdAndUpdate(id, data, { new: true });
        if (reg) {
            res.status(200).send({ data: reg });
        } else {
            res.status(404).send({ message: 'Tarifa no encontrada' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error al editar la tarifa', error });
    }
};

// Eliminar tarifa
const eliminar_tarifa = async function(req, res) {
    const id = req.params['id'];
    try {
        var reg = await Tarifa.findByIdAndDelete(id);
        if (reg) {
            res.status(200).send({ message: 'Tarifa eliminada con éxito', data: reg });
        } else {
            res.status(404).send({ message: 'Tarifa no encontrada' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error al eliminar la tarifa', error });
    }
};

module.exports = {
    registro_tarifa,
    listar_tarifas,
    obtener_tarifa_por_id,
    editar_tarifa,
    eliminar_tarifa 
};
