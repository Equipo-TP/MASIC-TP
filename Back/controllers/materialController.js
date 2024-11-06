'use strict';

const Material = require('../models/Material');

// Registrar un nuevo material
const registrarMaterial = async function (req, res) {
    const data = req.body;

    try {
        const materialExistente = await Material.findOne({ nombre: data.nombre });
        if (!materialExistente) {
            if (data.nombre && data.categoria && data.stock !== undefined && data.unidad_medida) {
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

module.exports = {
    registrarMaterial,
    listarMateriales,
    obtenerMaterialPorId,
    editarMaterial,
    eliminarMaterial
};