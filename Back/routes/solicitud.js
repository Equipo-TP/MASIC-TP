'use strict'

const express = require('express');
const solicitudController = require('../controllers/SolicitudController');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const auth = require('../middlewares/authenticate').auth;

const api = express.Router();

// Configuración de almacenamiento de multer con GridFS
const storage = new GridFsStorage({
    url: 'mongodb+srv://valery:proyectotp24@masic.xd5ik.mongodb.net/Masic',
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        return {
            bucketName: 'uploads',
            filename: `${Date.now()}-${file.originalname}`
        };
    }
});

const upload = multer({ storage });

api.post('/registro_solicitud', solicitudController.registro_solicitud);

// Rutas para subir y obtener archivos
api.post('/upload', upload.single('file'), solicitudController.uploadFile);
api.get('/archivo/:filename', solicitudController.getFile);

api.get('/listar_solicitudes_vendedora', auth, solicitudController.listar_solicitudes_vendedora);
api.get('/listar_solicitudes_administrador', solicitudController.listar_solicitudes_administrador);
api.put('/editar_solicitud/:id', solicitudController.editar_solicitud);

api.post('/obtenerSolicitudesPorCliente/:id', solicitudController.obtenerSolicitudesPorCliente);

api.post('/obtener_solicitud_por_id/:id', solicitudController.obtener_solicitud_por_id);
api.get('/listar_solicitudes_aprobadas', solicitudController.listar_solicitudes_aprobadas);
api.get('/listar_solicitudes_aprobadas_para_presupuesto', solicitudController.listar_solicitudes_aprobadas_para_presupuesto);


module.exports = api;