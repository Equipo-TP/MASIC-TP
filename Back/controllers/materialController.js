'use strict';

const Material = require('../models/Material');
const Inventario = require('../models/Inventario');

// Registrar un nuevo material
const registrarMaterial = async function (req, res) {
    const data = req.body;

    try {
        const materialExistente = await Material.findOne({ nombre: data.nombre });
        if (!materialExistente) {
            if (data.nombre && data.stock !== undefined && data.unidad_medida) {
                const nuevoMaterial = await Material.create(data);
                res.status(200).send({ data: nuevoMaterial });
            } else {
                res.status(400).send({ message: 'Complete todos los datos' });
            }
        } else {
            res.status(400).send({ message: 'El material ya existe en la base de datos' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error al registrar el material', error });
    }
};

// Listar todos los materiales
const listarMateriales = async function (req, res) {
    try {
        const materiales = await Material.find().sort({ fecha_registro: -1 });
        res.status(200).send({ data: materiales });
    } catch (error) {
        res.status(500).send({ message: 'Error al listar materiales', error });
    }
};

// Obtener un material por su ID
const obtenerMaterialPorId = async function (req, res) {
    const id = req.params['id'];

    try {
        const material = await Material.findById(id);
        if (material) {
            res.status(200).send({ data: material });
        } else {
            res.status(404).send({ message: 'Material no encontrado' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error al obtener el material', error });
    }
};

// Editar un material
const editarMaterial = async function (req, res) {
    const id = req.params['id'];
    const data = req.body;
    try {
        const materialActualizado = await Material.findByIdAndUpdate(
            id,
            {
                nombre: data.nombre,
                categoria: data.categoria,
                stock: data.stock,
                unidad_medida: data.unidad_medida,
                fecha_registro: data.fecha_registro
            },
            { new: true }
        );
        if (materialActualizado) {
            res.status(200).send({ data: materialActualizado });
        } else {
            res.status(404).send({ message: 'Material no encontrado para editar' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error al editar el material', error });
    }
};

// Eliminar un material
const eliminarMaterial = async function (req, res) {
    const id = req.params.id;
    try {
        const materialEliminado = await Material.findByIdAndDelete(id);
        if (materialEliminado) {
            res.status(200).send({ message: 'Material eliminado correctamente', data: materialEliminado });
        } else {
            res.status(404).send({ message: 'Material no encontrado' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error al eliminar el material', error });
    }
};

// Registrar un movimiento en el inventario (INGRESO O EGRESO)
const registrarMovimiento = async function (req, res) {
    let data = req.body;
    try {
        // Crear el registro de movimiento
        let reg = await Inventario.create(data);
        
        // Obtener el material para actualizar el stock
        let material = await Material.findById({ _id: reg.id_material });
        
        // Actualizar el stock total y el stock físico según el tipo de movimiento
        let nuevo_stock = material.stock;
        let nuevo_stock_fisico = material.stock_fisico;

        // Si es un ingreso, aumentamos el stock total y físico
        if (reg.tipo_movimiento === 'Ingreso') {
            nuevo_stock += reg.cantidad;
            if (reg.motivo === 'Compra') {
                nuevo_stock_fisico += reg.cantidad;
            }
        } else if (reg.tipo_movimiento === 'Egreso') {
            // Si es egreso, reducimos el stock total y físico
            nuevo_stock -= reg.cantidad;
            nuevo_stock_fisico -= reg.cantidad;
        }

        // Actualizar el stock y stock físico en el material
        await Material.findByIdAndUpdate({ _id: reg.id_material }, {
            stock: nuevo_stock,
            stock_fisico: nuevo_stock_fisico
        });

        res.status(200).send({ message: 'Movimiento registrado correctamente', data: reg });
        
    } catch (error) {
        console.error('Error al crear el inventario:', error);
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
        let movimiento = await Inventario.find({ id_material: id });
        if (movimiento) {
            res.status(200).send({ data: movimiento });
        } else {
            res.status(404).send({ message: 'Movimiento no encontrado' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error al obtener movimiento', error });
    }
};

// Eliminar movimiento del inventario
const eliminarMovimiento = async function (req, res) {
    const id = req.params['id'];
    try {
        const movimiento = await Inventario.findById(id);
        if (!movimiento) {
            return res.status(404).send({ message: 'Movimiento no encontrado' });
        }
        // Actualizar el stock del material al eliminar un movimiento
        const material = await Material.findById(movimiento._id);
        if (material) {
            material.stock -= movimiento.cantidad; // Revertir el cambio de stock
            await material.save();
        }

        await movimiento.deleteOne(); // Eliminar el movimiento
        res.status(200).send({ message: 'Movimiento eliminado correctamente', data: movimiento });
    } catch (error) {
        res.status(500).send({ message: 'Error al eliminar movimiento', error });
    }
};

module.exports = {
    registrarMaterial,
    listarMateriales,
    obtenerMaterialPorId,
    editarMaterial,
    eliminarMaterial,
    registrarMovimiento,
    listarMovimientos,
    obtenerMovimientoPorId,
    eliminarMovimiento
};