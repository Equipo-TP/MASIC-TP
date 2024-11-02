'use strict';

const Proyecto = require('../models/proyecto');
const Presupuesto = require('../models/presupuesto');

const registro_proyecto = async function(req, res) {
    try {
        var data = req.body;

        // Verifica que el presupuesto asociado exista
        var presupuesto = await Presupuesto.findById(data.ID_Presupuesto_Proyecto);
        if (!presupuesto) {
            return res.status(404).send({ message: 'Presupuesto no encontrado' });
        }

        // Verifica que no exista un proyecto asociado al presupuesto
        const proyectoExistente = await Proyecto.findOne({ ID_Presupuesto_Proyecto: data.ID_Presupuesto_Proyecto });
        if (proyectoExistente) {
            return res.status(400).send({ message: 'Ya existe un proyecto para este presupuesto', proyectoExistente });
        }

        // Crea el proyecto
        const nuevoProyecto = await Proyecto.create({
            ID_Proyecto: data.ID_Proyecto || presupuesto._id,
            ID_Presupuesto_Proyecto: data.ID_Presupuesto_Proyecto,
            IGV: data.IGV,
            Fecha_Trabajo: data.Fecha_Trabajo,
            Hora_Trabajo: data.Hora_Trabajo,
            Nombre_Proyecto: data.Nombre_Proyecto,
            Descripcion: data.Descripcion,
            Direccion: data.Direccion,
            estado: data.estado
        });

        res.status(200).send({ data: nuevoProyecto });
    } catch (error) {
        res.status(500).send({ message: 'Error al registrar el proyecto', error });
    }
};

const ver_proyecto_id = async function(req, res) {
    const id = req.params['id'];
    try {
        const proyecto = await Proyecto.findById(id).populate({
            path: 'ID_Presupuesto_Proyecto',
            populate: {
                path: 'ID_Solicitud_Presupuesto', // Puede requerir ajustar para campos específicos del presupuesto o solicitud
                populate: ['cliente', 'vendedor']
            }
        });
        if (proyecto) {
            res.status(200).send({ data: proyecto });
        } else {
            res.status(404).send({ message: 'Proyecto no encontrado' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error al obtener el proyecto', error });
    }
};

const obtener_proyecto_por_presupuesto = async function(req, res) {
    const presupuestoId = req.params['id'];
    try {
        const proyecto = await Proyecto.findOne({ ID_Presupuesto_Proyecto: presupuestoId });
        if (proyecto) {
            res.status(200).send({ data: proyecto });
        } else {
            res.status(404).send({ message: 'Proyecto no encontrado' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error al obtener el proyecto por presupuesto', error });
    }
};

const editar_proyecto = async function(req, res) {
    const id = req.params['id'];
    try {
        const data = req.body;
        const proyectoActualizado = await Proyecto.findByIdAndUpdate(
            id,
            {
                ID_Proyecto: data.ID_Proyecto,
                ID_Presupuesto_Proyecto: data.ID_Presupuesto_Proyecto,
                IGV: data.IGV,
                Fecha_Trabajo: data.Fecha_Trabajo,
                Hora_Trabajo: data.Hora_Trabajo,
                Nombre_Proyecto: data.Nombre_Proyecto,
                Descripcion: data.Descripcion,
                Direccion: data.Direccion,
                estado: data.estado
            },
            { new: true }
        );

        if (proyectoActualizado) {
            res.status(200).send({ data: proyectoActualizado });
        } else {
            res.status(404).send({ message: 'Proyecto no encontrado' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error al editar el proyecto', error });
    }
};

const eliminar_proyecto = async function(req, res) {
    const id = req.params['id'];
    try {
        const proyectoEliminado = await Proyecto.findByIdAndDelete(id);
        if (proyectoEliminado) {
            res.status(200).send({ message: 'Proyecto eliminado con éxito', data: proyectoEliminado });
        } else {
            res.status(404).send({ message: 'Proyecto no encontrado' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error al eliminar el proyecto', error });
    }
};

const listar_proyectos = async function(req, res) {
    try {
        const proyectos = await Proyecto.find().populate({
            path: 'ID_Presupuesto_Proyecto',
            populate: {
                path: 'ID_Solicitud_Presupuesto',
                populate: ['cliente', 'vendedor']
            }
        });
        res.status(200).send({ data: proyectos });
    } catch (error) {
        res.status(500).send({ message: 'Error al listar proyectos', error });
    }
};

module.exports = {
    registro_proyecto,
    ver_proyecto_id,
    obtener_proyecto_por_presupuesto,
    editar_proyecto,
    eliminar_proyecto,
    listar_proyectos
};
