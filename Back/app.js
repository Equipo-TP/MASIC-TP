'use strict'

//creación de variables para guardar los paquetes instalados
var cors = require('cors');
var express = require('express');
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
//declaramos la variable app que manejaremos mediante express
var app = express();

var user_route = require('./routes/usuario');
var solicitud_route = require('./routes/solicitud');
var cliente_route = require('./routes/cliente');
var instalacion_route = require('./routes/instalacion');
var presupuesto_route = require('./routes/presupuesto');
var tarifa_route = require('./routes/tarifa');

//llamamos a la variable mongoose para que se conecte con mongodb al puerto 27017
mongoose.connect('mongodb+srv://valery:proyectotp24@masic.xd5ik.mongodb.net/Masic', {useUnifiedTopology: true, useNewUrlParser: true})
  //Uso de la función flecha (then y catch) para el manejo de respuestas y errores
   .then(() => {
     console.log('Conexión establecida correctamente con la base de datos');
     //Configuración del puerto en el que se desea que se ejecute el servidor
     const PORT = 8000;
     //Inicia el servidor en el puerto especificado
     app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
     });
   })
   .catch(err => console.error('Error al conectar a la base de datos:', err));

app.use(cors({
    origin: 'http://localhost:5173'
}));
//permite al back recibir e interpretar los datos de formularios html
app.use(bodyparser.urlencoded({extended:true}));
//permite al back recibir e interpretar los datos ingresados en formato json
app.use(express.json({limit:'50mb', extended:true}));

//manejo de las solicitudes
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods','GET, PUT, POST, DELETE, OPTIONS');
    res.header('Allow','GET, PUT, POST, DELETE, OPTIONS');
    next();
});

app.use('/api', user_route);
app.use('/api', solicitud_route);
app.use('/api', cliente_route);
app.use('/api', instalacion_route);
app.use('/api', presupuesto_route);
app.use('/api', tarifa_route);

//Exportación del módulo app para que se puedan comunicar entre sí
module.exports = app;