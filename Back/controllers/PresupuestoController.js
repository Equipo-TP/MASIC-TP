'use strict';

const Presupuesto = require('../models/presupuesto');
const Solicitud = require('../models/solicitud');


const registro_presupuesto = async function(req, res) {
    try {
        var data = req.body;

       
        var solicitud = await Solicitud.findById( data.ID_Solicitud_Presupuesto);
        if (!solicitud) {
            return res.status(404).send({message: 'Solicitud no encontrada'});
        }
        console.log(solicitud);
        
        var presupuestoExistente = await Presupuesto.findOne({ ID_Solicitud_Presupuesto: data.ID_Solicitud_Presupuesto });
        if (presupuestoExistente) {
            return res.status(400).send({message: 'Ya existe un presupuesto para esta solicitud', data: undefined});
        } else {
            console.log('hola');
            var presupuesto = await Presupuesto.create(data);
            res.status(200).send({data:reg.toJSON()});
        }
        
        var presupuesto = await Presupuesto.create({
            ID_Solicitud_Presupuesto: data.ID_Solicitud_Presupuesto,
            IGV: data.IGV || 18, 
            Tiempo: data.Tiempo,
            Transporte_Personal: data.Transporte_Personal,
            Materiales: data.Materiales,
            Costo_Materiales: data.Costo_Materiales,
            Costo_Transporte: data.Costo_Transporte
        });
        console.log(presupuesto);
        res.status(200).send({data: presupuesto});
    } catch (error) {
        res.status(500).send({message: 'Error al registrar el presupuesto', error});
    }
};


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


const editar_presupuesto = async function(req, res) {
    const id = req.params['id'];
    try {
        const data = req.body;
        const presupuesto = await Presupuesto.findByIdAndUpdate({_id: id}, {
            IGV: data.IGV || 18, 
            Tiempo: data.Tiempo,
            Transporte_Personal: data.Transporte_Personal,
            Materiales: data.Materiales,
            Costo_Materiales: data.Costo_Materiales,
            Costo_Transporte: data.Costo_Transporte
        }, {new: true});

        res.status(200).send({data: presupuesto});
    } catch (error) {
        res.status(500).send({message: 'Error al editar el presupuesto', error});
    }
};


const eliminar_presupuesto = async function(req, res) {
    const id = req.params['id'];
    try {
      
        const presupuesto = await Presupuesto.findByIdAndDelete({_id: id});
        if (presupuesto) {
            res.status(200).send({message: 'Presupuesto eliminado con éxito', data: presupuesto});
        } else {
            res.status(404).send({message: 'Presupuesto no encontrado'});
        }
    } catch (error) {
        res.status(500).send({message: 'Error al eliminar el presupuesto', error});
    }
};
const listar_presupuestos = async function(req, res) {
    try {
        const presupuestos = await Presupuesto.find();
        res.status(200).send({data: presupuestos});
    } catch (error) {
        res.status(500).send({message: 'Error al listar presupuestos', error});
    }
};

const listar_presupuestos_vendedora = async function(req, res) {
    const vendedoraId = req.params['id'];  // 
    try {
       
        const solicitudes = await Solicitud.find({ ID_Vendedora: vendedoraId });

        if (!solicitudes.length) {
            return res.status(404).send({ message: 'No se encontraron solicitudes para esta vendedora' });
        }

       
        const solicitudIds = solicitudes.map(solicitud => solicitud._id);

       
        const presupuestos = await Presupuesto.find({ ID_Solicitud_Presupuesto: { $in: solicitudIds } });

        res.status(200).send({ data: presupuestos });
    } catch (error) {
        res.status(500).send({ message: 'Error al listar presupuestos por vendedora', error });
    }
};
module.exports = {
    registro_presupuesto,
    obtener_presupuesto_por_solicitud,
    editar_presupuesto,
    eliminar_presupuesto,
    listar_presupuestos,
    listar_presupuestos_vendedora,
};
