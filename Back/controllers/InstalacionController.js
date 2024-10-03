'use strict';

var Instalacion = require('../models/instalacion');

// Registro de precio de instalación
const registro_precio_instalacion = async function (req, res) {
    var data = req.body;

    var instalacion_arr = await Instalacion.find({ tipo_luminaria: data.tipo_luminaria });
    
    if (instalacion_arr.length === 0) {
        // Registrando
        var reg = await Instalacion.create(data);
        res.status(200).send({ 
            
            data: reg.toJSON() });
    } else {
        res.status(400).send({ message: 'El tipo de instalación ya existe en la base de datos', data: undefined }); // Cambiar a 400
    }
};

// Listar tarifas
const listar_tarifario = async function (req, res) {
    try {
        var reg = await Instalacion.find().sort({ createdAt: -1 });
        res.status(200).send({ data: reg });
    } catch (error) {
        res.status(500).send({ message: 'Error al listar tarifas', error });
    }
};

// Obtener tarifa por ID
const obtener_tarifario_por_id = async function (req, res) {
    const id = req.params['id'];
    try {
        let instalacion = await Instalacion.findById(id); // No es necesario usar un objeto
        if (instalacion) {
            res.status(200).send({ data: instalacion });
        } else {
            res.status(404).send({ message: 'Tarifa no encontrada' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error al obtener la tarifa', error });
    }
};

// Editar tarifa
const editar_tarifa = async function (req, res) {
    const id = req.params['id'];
    var data = req.body;
    try {
        var reg = await Instalacion.findByIdAndUpdate(id, { // Cambiar a solo el ID
            tipo_luminaria: data.tipo_luminaria,
            descripcion: data.descripcion,
            precio: data.precio
        }, { new: true }); // Devuelve el documento actualizado
        if (reg) {
            res.status(200).send({ data: reg });
        } else {
            res.status(404).send({ message: 'Tarifa no encontrada para editar', data: undefined });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error al editar la tarifa', error });
    }
};

// Eliminar tarifa según ID
const eliminar_tarifa = async function (req, res) {
    const id = req.params.id;
    try {
        let tarifaEliminada = await Instalacion.findByIdAndDelete(id);
        if (tarifaEliminada) {
            res.status(200).send({ message: 'Tarifa eliminada correctamente', data: tarifaEliminada });
        } else {
            res.status(404).send({ message: 'Tarifa no encontrada' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error al eliminar la tarifa', error });
    }
};

module.exports = {
    registro_precio_instalacion,
    listar_tarifario,
    obtener_tarifario_por_id,
    editar_tarifa,
    eliminar_tarifa
};
