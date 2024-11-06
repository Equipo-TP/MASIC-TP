'use strict'

var express = require('express');
var multer = require('multer');
var solicitudController = require('../controllers/SolicitudController');

var api = express.Router();
var auth = require('../middlewares/authenticate').auth;

const path = require('path');


// Configuración de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Ruta donde se guardarán los archivos
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Usa el nombre original del archivo
    }
});

const upload = multer({ storage: storage });

api.post('/registro_solicitud', upload.array('archivos'), solicitudController.registro_solicitud);
api.get('/listar_solicitudes_vendedora', auth, solicitudController.listar_solicitudes_vendedora);
api.get('/listar_solicitudes_administrador', solicitudController.listar_solicitudes_administrador);
api.put('/editar_solicitud/:id', solicitudController.editar_solicitud);

api.post('/obtenerSolicitudesPorCliente/:id', solicitudController.obtenerSolicitudesPorCliente);

api.post('/obtener_solicitud_por_id/:id', solicitudController.obtener_solicitud_por_id);
api.get('/listar_solicitudes_aprobadas', solicitudController.listar_solicitudes_aprobadas);
api.get('/listar_solicitudes_aprobadas_para_presupuesto', solicitudController.listar_solicitudes_aprobadas_para_presupuesto);

api.get('/descargar-archivo/:filename', (req, res) => {
    const fileName = req.params.filename; // Obtiene el nombre del archivo desde los parámetros
    const filePath = path.join(__dirname, '../uploads', fileName); // Construye el path completo al archivo
  
    // Intenta descargar el archivo
    res.download(filePath, (err) => {
      if (err) {
        console.error('Error al descargar el archivo:', err);
        res.status(500).send('Error al descargar el archivo');
      }
    });
  });


module.exports = api;