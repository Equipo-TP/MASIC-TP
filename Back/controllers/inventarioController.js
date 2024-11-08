'use strict';

const Inventario = require('../models/Inventario');

// Registrar un movimiento en el inventario
const registrarMovimiento = async function (req, res) {
    const data = req.body;
    try {
        if (!data.id_Inventario || !data.cantidad || !data.fecha_mov) {
            return res.status(400).send({ message: 'Faltan datos obligatorios' });
        }

        const nuevoMovimiento = new Inventario({
            id_Inventario: data.id_Inventario, // Nuevo campo de ID
            cantidad: data.cantidad,
            fecha_mov: data.fecha_mov
        });

        const movimientoGuardado = await nuevoMovimiento.save();
        res.status(201).send({ message: 'Movimiento registrado correctamente', data: movimientoGuardado });
    } catch (error) {
        res.status(500).send({ message: 'Error al registrar movimiento', error });
    }
};

// Listar movimientos del inventario
const listarMovimientos = async function (req, res) {
    try {
        const movimientos = await Inventario.find().sort({ fecha_mov: -1 });
        res.status(200).send({ data: movimientos });
    } catch (error) {
        res.status(500).send({ message: 'Error al listar movimientos', error });
    }
};

// Obtener movimiento por ID de inventario
const obtenerMovimientoPorId = async function (req, res) {
    const id = req.params['id'];
    try {
        const movimiento = await Inventario.findOne({ id_Inventario: id });
        if (movimiento) {
            res.status(200).send({ data: movimiento });
        } else {
            res.status(404).send({ message: 'Movimiento no encontrado' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error al obtener movimiento', error });
    }
};

// Editar movimiento del inventario
const editarMovimiento = async function (req, res) {
    const id = req.params['id'];
    const data = req.body;
    try {
        const movimientoActualizado = await Inventario.findByIdAndUpdate(
            id,
            {
                cantidad: data.cantidad,
                fecha_mov: data.fecha_mov
            },
            { new: true }
        );

        if (movimientoActualizado) {
            res.status(200).send({ data: movimientoActualizado });
        } else {
            res.status(404).send({ message: 'Movimiento no encontrado para editar' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error al editar movimiento', error });
    }
};

// Eliminar movimiento del inventario
const eliminarMovimiento = async function (req, res) {
    const id = req.params['id'];
    try {
        const movimientoEliminado = await Inventario.findOneAndDelete({ _id: id });
        if (movimientoEliminado) {
            res.status(200).send({ message: 'Movimiento eliminado correctamente', data: movimientoEliminado });
        } else {
            res.status(404).send({ message: 'Movimiento no encontrado' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error al eliminar movimiento', error });
    }
};

module.exports = {
    registrarMovimiento,
    listarMovimientos,
    obtenerMovimientoPorId,
    editarMovimiento,
    eliminarMovimiento
};
