'use strict';

const Proyecto = require('../models/proyecto');
const Contador = require('../models/contador');
const Presupuesto = require('../models/presupuesto');

// Función para obtener el próximo ID para el proyecto
async function obtenerProximoId(nombreContador) {
    const contador = await Contador.findOneAndUpdate(
        { nombre: nombreContador },
        { $inc: { valor: 1 } },
        { new: true, upsert: true }
    );
    return contador.valor;
}

// Función para verificar disponibilidad de técnicos en el cronograma
async function verificarDisponibilidadTecnico(tecnicoId, fecha_inicio, fecha_final) {
    const conflicto = await Proyecto.findOne({
        'Horario.Tecnico': tecnicoId,
        $or: [
            { 'Horario.fecha_inicio': { $lte: fecha_final }, 'Horario.fecha_final': { $gte: fecha_inicio } }
        ]
    });
    return !conflicto;
}

// Registrar un nuevo proyecto
const registrar_proyecto = async function(req, res) {
    try {
        const data = req.body;
        const nuevoId = await obtenerProximoId('proyectos');
        data.ID_Proyecto = nuevoId;

        for (const Horario of data.Horario) {
            const { fecha_inicio, fecha_final, Tecnico } = Horario;

            if (fecha_inicio && fecha_final && new Date(fecha_final) <= new Date(fecha_inicio)) {
                return res.status(400).send({ message: 'La fecha final debe ser posterior a la fecha de inicio' });
            }

            for (const tecnicoId of Tecnico) {
                const disponible = await verificarDisponibilidadTecnico(tecnicoId, fecha_inicio, fecha_final);
                if (!disponible) {
                    return res.status(400).send({ message: `El técnico ${tecnicoId} ya está asignado a otro proyecto en las mismas fechas` });
                }
            }
        }

        const proyectoExistente = await Proyecto.findOne({ ID_Presupuesto_Proyecto: data.ID_Presupuesto_Proyecto });
        if (!proyectoExistente) {
            const nuevoProyecto = await Proyecto.create(data);
            res.status(200).send({ data: nuevoProyecto });
        } else {
            res.status(400).send({ message: 'El proyecto ya existe para este presupuesto' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error al registrar el proyecto', error });
    }
};

// Listar todos los proyectos
const listar_proyectos = async function(req, res) {
    try {
        const proyectos = await Proyecto.find()
            .populate({
                path: 'ID_Presupuesto_Proyecto',
                populate: {
                    path: 'ID_Solicitud_Presupuesto',
                    populate: ['cliente', 'vendedor']
                }
            })
            .populate('Horario.Tecnico')
            .populate('Incidencias.afectado');
        res.status(200).send({ data: proyectos });
    } catch (error) {
        res.status(500).send({ message: 'Error al listar proyectos', error });
    }
};

// Ver un proyecto por su ID
const ver_proyecto_por_id = async function(req, res) {
    const id = req.params.id;
    try {
        const proyecto = await Proyecto.findById(id)
            .populate({
                path: 'ID_Presupuesto_Proyecto',
                populate: {
                    path: 'ID_Solicitud_Presupuesto',
                    populate: ['cliente', 'vendedor']
                }
            })
            .populate('Horario.Tecnico')
            .populate('Incidencias.afectado');
        if (proyecto) {
            res.status(200).send({ data: proyecto });
        } else {
            res.status(404).send({ message: 'Proyecto no encontrado' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error al obtener el proyecto', error });
    }
};

// Editar un proyecto por su ID
const editar_proyecto_por_id = async function(req, res) {
    const id = req.params.id;
    const data = req.body;
    try {
        for (const Horario of data.Horario) {
            const { fecha_inicio, fecha_final, Tecnico } = Horario;

            if (fecha_inicio && fecha_final && new Date(fecha_final) <= new Date(fecha_inicio)) {
                return res.status(400).send({ message: 'La fecha final debe ser posterior a la fecha de inicio' });
            }

            for (const tecnicoId of Tecnico) {
                const disponible = await verificarDisponibilidadTecnico(tecnicoId, fecha_inicio, fecha_final);
                if (!disponible) {
                    return res.status(400).send({ message: `El técnico ${tecnicoId} ya está asignado a otro proyecto en las mismas fechas` });
                }
            }
        }

        const proyecto = await Proyecto.findByIdAndUpdate(
            { _id: id },
            {
                ID_Presupuesto_Proyecto: data.ID_Presupuesto_Proyecto,
                Costo_Total: data.Costo_Total,
                Horario: data.Horario,
                GestionarMaterial: data.GestionarMaterial,
                Nombre_Proyecto: data.Nombre_Proyecto,
                Descripcion: data.Descripcion,
                Estado: data.Estado,
                Observacion: data.Observacion,
                Incidencias: data.Incidencias
            },
            { new: true }
        );
        if (proyecto) {
            res.status(200).send({ data: proyecto });
        } else {
            res.status(404).send({ message: 'Proyecto no encontrado' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error al editar el proyecto', error });
    }
};

// Listar proyectos en los que un técnico específico está involucrado
const listar_proyectos_por_tecnico = async function(req, res) {
    const tecnicoId = req.params.tecnicoId;

    try {
        const proyectos = await Proyecto.find({ 'Horario.Tecnico': tecnicoId })
            .populate({
                path: 'ID_Presupuesto_Proyecto',
                populate: {
                    path: 'ID_Solicitud_Presupuesto',
                    populate: ['cliente', 'vendedor']
                }
            })
            .populate('Horario.Tecnico')
            .populate('Incidencias.afectado');

        if (proyectos.length > 0) {
            res.status(200).send({ data: proyectos });
        } else {
            res.status(404).send({ message: 'No se encontraron proyectos para este técnico' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error al listar proyectos del técnico', error });
    }
};

module.exports = {
    registrar_proyecto,
    listar_proyectos,
    ver_proyecto_por_id,
    listar_proyectos_por_tecnico,
    editar_proyecto_por_id
};
