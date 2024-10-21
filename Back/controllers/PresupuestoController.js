'use strict';

const Presupuesto = require('../models/presupuesto');
const Solicitud = require('../models/solicitud');
const Instalacion = require('../models/instalacion');


const registro_presupuesto = async function(req, res) {
    try {
        var data = req.body;

        var solicitud = await Solicitud.findById( data.ID_Solicitud_Presupuesto);
        if (!solicitud) {
            return res.status(404).send({message: 'Solicitud no encontrada'});
        }
        console.log(solicitud);
        console.log('Hola');
        console.log(data.instalaciones);

        for (const instalacionData of data.instalaciones) {
            console.log(instalacionData.tipo_luminaria);
        var instalacion = await Instalacion.findById(instalacionData.tipo_luminaria);
        if (!instalacion) {
          return res.status(404).send({ message: 'Instalación no encontrada' });
        }
        //console.log('Hola');
        console.log(instalacion);
 
        instalacionData.costo_total = instalacionData.cantidad * instalacion.precio; 
        console.log(instalacionData.costo_total);    
    }

    let instalaciones = data.instalaciones.map(instalacionData => {
        return {
            tipo_luminaria: instalacionData.tipo_luminaria,
            cantidad: Number(instalacionData.cantidad) || 0, // Asegúrate de que cantidad es un número
            costo_total: Number(instalacionData.costo_total) || 0 // Asegúrate de que costo_total es un número
        };
    });

    // Calcula el total de todos los costos de las instalaciones
    let costoTotalInstalaciones = instalaciones.reduce((total, instalacion) => {
    return total + (instalacion.costo_total || 0); // Suma el costo_total por cantidad
    }, 0);

    // Asegúrate de que Costo_Materiales y Costo_Transporte son números
    let costoMateriales = Number(data.Costo_Materiales) || 0; // Convierte a número o usa 0 si no es válido
    let costoTransporte = Number(data.Costo_Transporte) || 0; // Convierte a número o usa 0 si no es válido

    data.sub_neto = (costoTotalInstalaciones + costoMateriales + costoTransporte);
    data.IGV = 0.18 * data.sub_neto;

    data.Pago_Total = costoTotalInstalaciones + costoMateriales + costoTransporte + data.IGV;
        var presupuestoExistente = [];
        presupuestoExistente = await Presupuesto.find({ ID_Solicitud_Presupuesto: data.ID_Solicitud_Presupuesto });
        if (presupuestoExistente.length == 0) {
            data.ID_Presupuesto = solicitud.id;
            console.log('hola');
            console.log(data.ID_Presupuesto);
            console.log(solicitud.id);
            var reg = await Presupuesto.create({
                ID_Presupuesto: data.ID_Presupuesto,
                ID_Solicitud_Presupuesto: data.ID_Solicitud_Presupuesto,
                IGV: data.IGV,
                Transporte_Personal: data.Transporte_Personal,
                instalaciones: instalaciones,
                Materiales: data.Materiales,
                Costo_Materiales: data.Costo_Materiales,
                Costo_Transporte: data.Costo_Transporte,
                Sub_Neto: data.sub_neto,
                Pago_Total: data.Pago_Total,
                estado_1: data.estado_1,
                estado_2: data.estado_2,

            });
            res.status(200).send({data:reg.toJSON()});
        } else {
            return res.status(400).send({message: 'Ya existe un presupuesto para esta solicitud', presupuestoExistente});
        }
    } catch (error) {
        res.status(500).send({message: 'Error al registrar el presupuesto', error});
    }
};

const ver_presupuesto_id = async function(req, res) {
    const id = req.params['id'];
    try {
        // Usamos .populate para popular el campo tipo_luminaria de la colección Instalaciones
        let presupuesto = await Presupuesto.findOne({_id: id}).populate({
            path: 'ID_Solicitud_Presupuesto',
            populate: [
              {
                path: 'cliente', // Asegúrate de que este es el campo dentro de ID_Solicitud_Presupuesto que guarda el cliente
              },
              {
                path: 'vendedor', // Asegúrate de que este es el campo dentro de ID_Solicitud_Presupuesto que guarda el vendedor
              }
            ]
          })
        .populate('instalaciones.tipo_luminaria');
        if (presupuesto) {
            res.status(200).send({data: presupuesto});
        } else {
            res.status(404).send({message: 'Presupuesto no encontrado'});
        }
    } catch (error) {
        res.status(500).send({message: 'Error al obtener el presupuesto', error});
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
        var data = req.body;     
        const presupuesto = await Presupuesto.findByIdAndUpdate({_id: id}, {
                ID_Presupuesto: data.ID_Presupuesto,
                ID_Solicitud_Presupuesto: data.ID_Solicitud_Presupuesto,
                IGV: data.IGV,
                Transporte_Personal: data.Transporte_Personal,
                instalaciones: data.instalaciones,
                Materiales: data.Materiales,
                Costo_Materiales: data.Costo_Materiales,
                Costo_Transporte: data.Costo_Transporte,
                Sub_Neto: data.sub_neto,
                Pago_Total: data.Pago_Total,
                estado_1: data.estado_1,
                estado_2: data.estado_2,
        }, {new: true});
        console.log(presupuesto);
        res.status(200).send({data: presupuesto});
    } catch (error) {
        res.status(500).send({message: 'Error al editar el presupuesto', data:undefined,error});
    }
};

const editar_presupuesto_admin = async function(req, res) {
    const id = req.params['id'];
    try {
        var data = req.body; 
        for (const instalacionData of data.instalaciones) {
            var instalacion = await Instalacion.findById(instalacionData.tipo_luminaria);
            if (!instalacion) {
              return res.status(404).send({ message: 'Instalación no encontrada' });
            }
            //console.log('Hola');
            console.log(instalacion);
     
            instalacionData.costo_total = instalacionData.cantidad * instalacion.precio; 
            console.log(instalacionData.costo_total);    
        }
    
    
        let instalaciones = data.instalaciones.map(instalacionData => {
            return {
                tipo_luminaria: instalacionData.tipo_luminaria,
                cantidad: Number(instalacionData.cantidad) || 0, // Asegúrate de que cantidad es un número
                costo_total: Number(instalacionData.costo_total) || 0 // Asegúrate de que costo_total es un número
            };
        }); 
        // Calcula el total de todos los costos de las instalaciones
    let costoTotalInstalaciones = instalaciones.reduce((total, instalacion) => {
        return total + (instalacion.costo_total || 0); // Suma el costo_total por cantidad
        }, 0);
    
        // Asegúrate de que Costo_Materiales y Costo_Transporte son números
        let costoMateriales = Number(data.Costo_Materiales) || 0; // Convierte a número o usa 0 si no es válido
        let costoTransporte = Number(data.Costo_Transporte) || 0; // Convierte a número o usa 0 si no es válido
    
        data.sub_neto = (costoTotalInstalaciones + costoMateriales + costoTransporte);
        data.IGV = 0.18 * data.sub_neto;
    
        data.Pago_Total = costoTotalInstalaciones + costoMateriales + costoTransporte + data.IGV;      
        const presupuesto = await Presupuesto.findByIdAndUpdate({_id: id}, {
                ID_Presupuesto: data.ID_Presupuesto,
                ID_Solicitud_Presupuesto: data.ID_Solicitud_Presupuesto,
                IGV: data.IGV,
                Transporte_Personal: data.Transporte_Personal,
                instalaciones: instalaciones,
                Materiales: data.Materiales,
                Costo_Materiales: data.Costo_Materiales,
                Costo_Transporte: data.Costo_Transporte,
                Sub_Neto: data.sub_neto,
                Pago_Total: data.Pago_Total,
                estado_1: data.estado_1,
                estado_2: data.estado_2,
        }, {new: true});
        console.log(presupuesto);
        res.status(200).send({data: presupuesto});
    } catch (error) {
        res.status(500).send({message: 'Error al editar el presupuesto', data:undefined,error});
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
        const presupuestos = await Presupuesto.find().populate({
            path: 'ID_Solicitud_Presupuesto',
            populate: [
              {
                path: 'cliente', // Asegúrate de que este es el campo dentro de ID_Solicitud_Presupuesto que guarda el cliente
              },
              {
                path: 'vendedor', // Asegúrate de que este es el campo dentro de ID_Solicitud_Presupuesto que guarda el vendedor
              }
            ]
          });
        res.status(200).send({data: presupuestos});
    } catch (error) {
        res.status(500).send({message: 'Error al listar presupuestos', error});
    }
};

const listar_presupuestos_vendedora = async function(req, res) {
    try {
       
        const solicitudes = await Solicitud.find({ vendedor: req.user._id });

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
    ver_presupuesto_id,
    obtener_presupuesto_por_solicitud,
    editar_presupuesto,
    editar_presupuesto_admin,
    eliminar_presupuesto,
    listar_presupuestos,
    listar_presupuestos_vendedora,
};

