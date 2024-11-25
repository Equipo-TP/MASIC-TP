'use strict';

var Cobro = require('../models/Cobro');

/*const registro_cobro = async function (req, res) {
    const data = req.body;
    try {
        const cobroExistente = await Cobro.findOne({ id: data.id });
        if (cobroExistente) {
            return res.status(400).send({ message: 'El cobro ya existe', data: undefined });
        }
        const nuevoCobro = await Cobro.create(data);
        res.status(200).send({ data: nuevoCobro });
    } catch (error) {
        res.status(500).send({ message: 'Error al registrar el cobro', error });
    }
};*/

/*const listar_proyecto = async function (req, res) {
    try {
        const cobros = await Cobro.find().sort({ fecha_registro: -1 });
        res.status(200).send({ data: cobros });
    } catch (error) {
        res.status(500).send({ message: 'Error al listar los cobros', error });
    }
};*/

/*const obtener_cobro_por_id = async function (req, res) {
    const id = req.params['id'];
    try {
        const cobro = await Cobro.findById(id);
        if (!cobro) {
            return res.status(404).send({ message: 'Cobro no encontrado', data: undefined });
        }
        res.status(200).send({ data: cobro });
    } catch (error) {
        res.status(500).send({ message: 'Error al obtener el cobro', error });
    }
};*/

/*const editar_cobro = async function (req, res) {
    const id = req.params['id'];
    const data = req.body;
    try {
        const cobroActualizado = await Cobro.findByIdAndUpdate(id, data, { new: true });
        if (!cobroActualizado) {
            return res.status(404).send({ message: 'Cobro no encontrado para actualizar', data: undefined });
        }
        res.status(200).send({ data: cobroActualizado });
    } catch (error) {
        res.status(500).send({ message: 'Error al actualizar el cobro', error });
    }
};*/

/*const eliminar_cobro = async function (req, res) {
    const id = req.params['id'];
    try {
        const cobroEliminado = await Cobro.findByIdAndDelete(id);
        if (!cobroEliminado) {
            return res.status(404).send({ message: 'Cobro no encontrado para eliminar', data: undefined });
        }
        res.status(200).send({ message: 'Cobro eliminado correctamente', data: cobroEliminado });
    } catch (error) {
        res.status(500).send({ message: 'Error al eliminar el cobro', error });
    }
};*/

const obtener_cobro_con_pagos = async function (req, res) {
    const id = req.params['id'];
    try {
        const cobro = await Cobro.findById(id);
        if (!cobro) {
            return res.status(404).send({ message: 'Cobro no encontrado', data: undefined });
        }
        res.status(200).send({ data: cobro });
    } catch (error) {
        res.status(500).send({ message: 'Error al obtener el cobro con pagos', error });
    }
};

//Informacion del cobro incluyendo pagos:

const obtener_proyecto_detallado = async function (req, res) {
    const id = req.params['id']; // ID del cobro
    try {
        // Buscar el cobro por ID
        const cobro = await Proyecto.findById(id);

        if (!cobro) {
            return res.status(404).send({ message: 'Cobro no encontrado', data: undefined });
        }

        // Retornar el cobro con la información de los pagos
        res.status(200).send({ data: cobro });
    } catch (error) {
        res.status(500).send({ message: 'Error al obtener los detalles del cobro', error });
    }
};

//listar los pagos

module.exports = {
    registro_cobro,
    listar_cobros,
    obtener_cobro_por_id,
    editar_cobro,
    eliminar_cobro,
    obtener_cobro_con_pagos,
    obtener_cobro_detallado
};