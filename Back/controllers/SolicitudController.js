'use strict'

//const cliente = require('../models/cliente');
var Solicitud = require('../models/solicitud');
const Contador = require('../models/contador'); 
const Presupuesto = require('../models/presupuesto');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');


// Inicializar GridFS
let gfs;
mongoose.connection.once('open', () => {
    gfs = Grid(mongoose.connection.db, mongoose.mongo);
    gfs.collection('uploads');
});

// Función para cargar un archivo (usada con multer)
const uploadFile = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No se ha subido ningún archivo' });
    }
    res.status(201).json({ file: req.file });
};

// Función para obtener un archivo específico por su nombre
const getFile = (req, res) => {
    const { filename } = req.params;
    gfs.files.findOne({ filename }, (err, file) => {
        if (!file || file.length === 0) {
            return res.status(404).json({ message: 'Archivo no encontrado' });
        }
        // Verificar si es una imagen
        if (file.contentType.includes('image')) {
            const readStream = gfs.createReadStream(file.filename);
            readStream.pipe(res);
        } else {
            res.status(400).json({ message: 'No es un archivo de imagen' });
        }
    });
};

async function obtenerProximoId(nombreContador) {
    const contador = await Contador.findOneAndUpdate(
        { nombre: nombreContador },
        { $inc: { valor: 1 } },
        { new: true, upsert: true }
    );
    return contador.valor;
}

const registro_solicitud = async function(req, res) {
    var data = req.body;
    const nuevoId = await obtenerProximoId('solicitudes');
    data.id = nuevoId;

    var solicitud_arr = await Solicitud.find({ id: data.id });
    if (solicitud_arr.length == 0) {
        var reg = await Solicitud.create(data);
        res.status(200).send({ data: reg.toJSON() });
    } else {
        res.status(200).send({ message: 'La solicitud ya existe en la base de datos', data: undefined });
    }
}

const listar_solicitudes_vendedora = async function(req, res) {
    const { page = 1, limit = 40 } = req.query; // Recibe page y limit desde la query
    const skip = (page - 1) * limit;

    try {
        const totalSolicitudes = await Solicitud.countDocuments({ vendedor: req.user._id });
        const solicitudes = await Solicitud.find({ vendedor: req.user._id })
            .populate('cliente')
            .skip(skip)
            .limit(limit);

        res.status(200).send({
            total: totalSolicitudes,
            totalPages: Math.ceil(totalSolicitudes / limit),
            currentPage: page,
            data: solicitudes
        });
    } catch (error) {
        res.status(500).send({ message: 'Error en la solicitud', error });
    }
}


const listar_solicitudes_administrador = async function(req,res) {
    var reg = await Solicitud.find({estado_1: 'Enviado'}).sort({createdAt:-1});
    res.status(200).send({data: reg});
};

const listar_solicitudes_aprobadas = async function(req,res) {
    var reg = await Solicitud.find({estado_2: 'Aprobado'}).sort({createdAt:-1});
    res.status(200).send({data: reg});
};
const listar_solicitudes_aprobadas_para_presupuesto = async function(req,res) {
    // Buscar todos los presupuestos y obtener la lista de IDs de solicitudes
    var presupuestos = await Presupuesto.find().select('ID_Solicitud_Presupuesto');
    var id_solicitudes_excluidas = presupuestos.map(presupuesto => presupuesto.ID_Solicitud_Presupuesto);

    // Buscar solicitudes aprobadas cuyo _id no esté en la lista de id_solicitudes_excluidas
    var reg = await Solicitud.find({
        estado_1: 'Enviado',
        estado_2: 'Aprobado',
        _id: { $nin: id_solicitudes_excluidas }
    }).sort({ createdAt: -1 }).populate('cliente').populate('vendedor');

    res.status(200).send({ data: reg });

};

//obtener solicitud por ID 
const obtener_solicitud_por_id = async function(req, res) {
    const id = req.params['id'];
    try {
        // Buscar la solicitud por ID y hacer populate en 'cliente'
        let solicitud = await Solicitud.findById(id).populate('cliente').populate('vendedor'); // Aquí se aplica el populate
        if (solicitud) {
            res.status(200).send({ data: solicitud });
        } else {
            res.status(404).send({ message: 'Solicitud no encontrada' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error al obtener la solicitud con ID ' + id, error });
    }
};


const editar_solicitud = async function(req, res) {
    var Id = req.params['id'];
    try {
    var data = req.body;
    var reg = await Solicitud.findByIdAndUpdate({_id:Id},{
        vendedor: data.vendedor,
        cliente: data.cliente,
        direccion: data.direccion,
        distrito: data.distrito,
        caracteristicas_obra: data.caracteristicas_obra,
        descripcion_servicio: data.descripcion_servicio,
        observaciones: data.observaciones,
        estado_1: data.estado_1,
        estado_2: data.estado_2,
        presupuesto: data.presupuesto,
    });
    res.status(200).send({data:reg});
    } catch{
        res.status(200).send({message:'no se escuentra', data: undefined});
    }
};

// Nueva función para obtener un cliente junto con sus solicitudes
const obtenerSolicitudesPorCliente = async function(req, res) {
    const clienteId = req.params.id;
    try {
        const reg = await Solicitud.find({cliente:clienteId});
        if (!reg) {
            return res.status(404).send({ message: 'No hay solicitudes' });
        }
        else {
            // Obtener las solicitudes del cliente

            res.status(200).send({ data:reg });
        }
        
    } catch (error) {
        res.status(500).send({ message: 'Error al obtener el cliente y sus solicitudes', error });
    }
};

module.exports = {
    registro_solicitud,
    listar_solicitudes_vendedora,
    listar_solicitudes_administrador,
    obtener_solicitud_por_id,
    editar_solicitud,
    obtenerSolicitudesPorCliente,
    listar_solicitudes_aprobadas,
    listar_solicitudes_aprobadas_para_presupuesto,
    uploadFile, // Agrega la función de carga de archivos
    getFile     // Agrega la función para obtener archivos
}