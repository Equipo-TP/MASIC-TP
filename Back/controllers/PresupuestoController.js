'use strict';

const Presupuesto = require('../models/presupuesto');
const Solicitud = require('../models/solicitud');

// Registro de presupuesto
const registro_presupuesto = async function(req, res) {
    try {
        var data = req.body;

        // Verificar si ya existe un presupuesto para la solicitud
        var solicitud = await Solicitud.findById({_id: data.ID_Solicitud_Presupuesto});
        if (!solicitud) {
            return res.status(404).send({message: 'Solicitud no encontrada'});
        }

        var presupuestoExistente = await Presupuesto.findOne({ ID_Solicitud_Presupuesto: data.ID_Solicitud_Presupuesto });
        if (presupuestoExistente) {
            return res.status(400).send({message: 'Ya existe un presupuesto para esta solicitud', data: undefined});
        }

        // Crear nuevo presupuesto
        var reg = await Presupuesto.create({
            ID_Solicitud_Presupuesto: data.ID_Solicitud_Presupuesto,
            IGV: data.IGV,
            Tiempo: data.Tiempo,
            Transporte_Personal: data.Transporte_Personal,
            Materiales: data.Materiales,
            Costo_Materiales: data.Costo_Materiales
        });

        res.status(200).send({data: reg});
    } catch (error) {
        res.status(500).send({message: 'Error al registrar el presupuesto', error});
    }
};

// Obtener presupuesto por ID de la solicitud
const obtener_presupuesto_por_solicitud = async function(req, res) {
    const solicitudId = req.params['id'];
    try {
        let presupuesto = await Presupuesto.findOne({ ID_Solicitud_Presupuesto: solicitudId });
        if (presupuesto) {
            res.status(200).send({data: presupuesto});
        } else {
            res.status(404).send({message: 'Presupuesto no encontrado'});
        }
    } catch (error) {
        res.status(500).send({message: 'Error al obtener el presupuesto', error});
    }
};

// Editar presupuesto
const editar_presupuesto = async function(req, res) {
    const id = req.params['id'];
    try {
        const data = req.body;
        const presupuesto = await Presupuesto.findByIdAndUpdate({_id: id}, {
            IGV: data.IGV,
            Tiempo: data.Tiempo,
            Transporte_Personal: data.Transporte_Personal,
            Materiales: data.Materiales,
            Costo_Materiales: data.Costo_Materiales
        }, {new: true});
        res.status(200).send({data: presupuesto});
    } catch (error) {
        res.status(500).send({message: 'Error al editar el presupuesto', error});
    }
};

module.exports = {
    registro_presupuesto,
    obtener_presupuesto_por_solicitud,
    editar_presupuesto
};
