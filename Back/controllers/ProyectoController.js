'use strict';

const Proyecto = require('../models/proyecto');
const Contador = require('../models/contador');
const Material = require('../models/Material');
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


const registrar_proyecto = async function (req, res) {
    try {
        const data = req.body;

        if (!data.Costo_Total || data.Costo_Total <= 0) {
            return res.status(400).send({ message: 'El costo total debe ser mayor a 0' });
        }


        const nuevoId = await obtenerProximoId('proyectos');
        data.ID_Proyecto = nuevoId;

        if (Array.isArray(data.GestionarMaterial) && data.GestionarMaterial.length > 0) {
            for (const material of data.GestionarMaterial) {
                const materialData = await Material.findById(material.id_Material);

                if (materialData) {
                    materialData.stock -= material.Cantidad;

                    if (materialData.stock < 0) {
                        materialData.Comentario = (materialData.Comentario || "") + " hace falta stock";
                    }

                    await materialData.save();
                } else {
                    return res.status(404).send({ message: `El material con ID ${material.id_Material} no existe.` });
                }
            }
        } else {
            console.log('No hay materiales');
            console.log(data);
        }

        data.totalCobrado = data.totalCobrado || 0;
        data.saldoRestante = data.Costo_Total - data.totalCobrado;
        data.estadodeCobro =
            data.totalCobrado === data.Costo_Total
                ? 'Cobrado Completamente'
                : data.totalCobrado > 0
                    ? 'Saldo Parcial'
                    : 'Por Cobrar';

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
const listar_proyectos = async function (req, res) {
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
const ver_proyecto_por_id = async function (req, res) {
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
const editar_proyecto_por_id = async function (req, res) {
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

        /*// Obtener el horario más cercano a la fecha actual
        const horarioMasCercano = data.Horario.reduce((prev, curr) => {
            const fechaActual = new Date();
            const diferenciaPrev = Math.abs(new Date(prev.fecha_inicio) - fechaActual);
            const diferenciaCurr = Math.abs(new Date(curr.fecha_inicio) - fechaActual);
            return diferenciaCurr < diferenciaPrev ? curr : prev;
        });

        const fechaInicioCercana = new Date(horarioMasCercano.fecha_inicio);
        const fechaActual = new Date();

        // Si la fecha más cercana coincide con la fecha actual
        if (fechaInicioCercana.toDateString() === fechaActual.toDateString()) {
            if (Array.isArray(data.GestionarMaterial) && data.GestionarMaterial.length > 0) {
                for (const material of data.GestionarMaterial) {
                    const materialData = await Material.findById(material.id_Material);

                    if (materialData) {
                        materialData.stock -= material.Cantidad;

                        if (materialData.stock < 0) {
                            materialData.Comentario = (materialData.Comentario || "") + " hace falta stock";
                        }

                        await materialData.save();
                    } else {
                        return res.status(404).send({ message: `El material con ID ${material.id_Material} no existe.` });
                    }
                }
            }
        }*/

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
                Incidencias: data.Incidencias,
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
const listar_proyectos_por_tecnico = async function (req, res) {
    const { page = 1, limit = 40 } = req.query;
    const skip = (page - 1) * limit;

    try {
        const totalProyectos = await Proyecto.countDocuments({ 'Horario.Tecnico': req.user._id });
        const proyectos = await Proyecto.find({ 'Horario.Tecnico': req.user._id })
            .populate('Horario.Tecnico')
            .populate({
                path: 'ID_Presupuesto_Proyecto',
                populate: {
                    path: 'ID_Solicitud_Presupuesto',
                    populate: ['cliente', 'vendedor']
                }
            })
            .skip(skip)
            .limit(limit);

        res.status(200).send({
            total: totalProyectos,
            totalPages: Math.ceil(totalProyectos / limit),
            currentPage: page,
            data: proyectos
        });
    } catch (error) {
        res.status(500).send({ message: 'Error al listar proyectos por técnico', error });
    }
};

// Ver pagos de un proyecto
const ver_pagos_proyecto = async function (req, res) {
    const id = req.params.id;
    try {
        const proyecto = await Proyecto.findById(id).populate('pagos');
        if (!proyecto) {
            return res.status(404).send({ message: 'Proyecto no encontrado' });
        }

        const porcentajeCobrado = calcularPorcentaje(proyecto.totalCobrado, proyecto.Costo_Total);

        res.status(200).send({
            data: proyecto,
            porcentajeCobrado,
            puedeEliminar: porcentajeCobrado === 100
        });
    } catch (error) {
        res.status(500).send({ message: 'Error al obtener los pagos del proyecto', error });
    }
};

// Actualizar cobros en un proyecto
const actualizar_cobros_proyecto = async function (req, res) {
    const id = req.params.id;
    const { monto, observaciones } = req.body;

    try {
        const proyecto = await Proyecto.findById(id);
        if (!proyecto) {
            return res.status(404).send({ message: 'Proyecto no encontrado' });
        }

        const nuevoPago = {
            monto,
            porcentaje: calcularPorcentaje(monto, proyecto.Costo_Total),
            fecha: new Date(),
            observaciones
        };

        proyecto.pagos.push(nuevoPago);
        proyecto.totalCobrado += monto;
        proyecto.saldoRestante = proyecto.Costo_Total - proyecto.totalCobrado;
        proyecto.estadodeCobro =
            proyecto.totalCobrado === proyecto.Costo_Total
                ? 'Cobrado Completamente'
                : proyecto.totalCobrado > 0
                    ? 'Saldo Parcial'
                    : 'Por Cobrar';

        await proyecto.save();

        res.status(200).send({ data: proyecto });
    } catch (error) {
        res.status(500).send({ message: 'Error al actualizar los cobros del proyecto', error });
    }
};

// Eliminar proyecto
const eliminar_proyecto = async function (req, res) {
    const id = req.params.id;
    console.log(id);
    try {
        const proyecto = await Proyecto.findByIdAndDelete(id);
        if (!proyecto) {
            return res.status(404).send({ message: 'Proyecto no encontrado' });
        }
        res.status(200).send({ message: 'Proyecto eliminado correctamente.' });
    } catch (error) {
        res.status(500).send({ message: 'Error al eliminar el proyecto', error });
    }
};


// Función para calcular el porcentaje de cobro
function calcularPorcentaje(totalCobrado, costoTotal) {
    return (totalCobrado / costoTotal) * 100;
}

module.exports = {
    registrar_proyecto,
    listar_proyectos,
    ver_proyecto_por_id,
    editar_proyecto_por_id,
    listar_proyectos_por_tecnico,
    ver_pagos_proyecto,
    actualizar_cobros_proyecto,
    eliminar_proyecto
}