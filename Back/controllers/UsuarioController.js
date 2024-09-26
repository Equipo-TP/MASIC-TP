'use strict'

var User = require('../models/usuario');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt');

const login_user = async function(req,res){
    var data = req.body;
    //creando arreglo de usuario
    var admin_arr = [];
    //buscando email con la bd
    admin_arr = await User.find({email:data.email});
    if (admin_arr == 0) {
        // no hay correo en bd
        res.status(200).send({message: 'No se encontro el correo', data:undefined});
        
    }
    else{
        //si hay email que coincide = login
        let user = admin_arr[0];
        //desenceriptando password
        bcrypt.compare(data.password, user.password, async function(error, check) {
            if (check) {
                // Si la contraseña coincide, se verifica el rol del usuario
                let role = user.rol;
                // Dependiendo del rol, se realiza una acción diferente
                if (role === 'Administrador') {
                // Si es un administrador, envía el token con privilegios de admin
                res.status(200).send({
                    data: user,
                    message: 'Bienvenido, Administrador',
                    role: 'Administrador',
                    name: `${user.nombre}  ${user.apellidos}`,
                    //genera token
                    token: jwt.createToken(user)
                });}
                else if (role === 'Vendedor') {
                    // Si es un vendedor, envía el token con privilegios de vendedor
                    res.status(200).send({
                        data: user,
                        message: 'Bienvenido, Vendedor',
                        role: 'Vendedor',
                        name: `${user.nombre}  ${user.apellidos}`,
                        token: jwt.createToken(user)
                    });
                } else if (role === 'Tecnico') {
                    // Si es un técnico, envía el token con privilegios de técnico
                    res.status(200).send({
                        data: user,
                        message: 'Bienvenido, Técnico',
                        role: 'Tecnico',
                        name: `${user.nombre}  ${user.apellidos}`,
                        token: jwt.createToken(user)
                    });
                } else {
                    // Si el rol no está definido
                    res.status(200).send({
                        message: 'El rol del usuario no es válido',
                       // data: undefined
                    });
                }
                
            }else{
                res.status(200).send({message: 'La contraseña no coincide', data:undefined});}
            
        });
    }
    
}

const registro_usuario = async function(req,res){
    //variable para que reciba toda la data que esta en el cuerpo del request
    var data = req.body;
    var user_arr = [];
    //buscando email, dni y telefono
    user_arr = await User.find({email:data.email}, {dni:data.dni}, {telefono:data.telefono});
    //si el # de resultado es cero
    if (user_arr.length == 0) {
        //y si hay contraseña       
        if (data.password) {
            //entonces crea
            bcrypt.hash(data.password, null, null, async function(err, hash) {
                if (hash) {
                    data.password = hash;
                    //registrando
                    var reg = await User.create(data);
                    res.status(200).send({data:reg});
                }else{
                    res.status(200).send({message:'ErrorServer',data: undefined});
                }
            })
        }else{
            res.status(200).send({message:'No hay una constraseña',data: undefined});
        }
    }else{
        res.status(200).send({message:'El usuario ya existe en la base de datos', data: undefined});
    }

}
//lista a todos los usuarios
const listar_usuarios = async function(req, res) {
    try {
        // Obtener todos los usuarios
        let usuarios = await User.find();
        res.status(200).send({ data: usuarios });
    } catch (error) {
        res.status(500).send({ message: 'Error al listar los usuarios', error });
    }
};
//elimina usuario segun id
const eliminar_usuario = async function(req, res) {
    const id = req.params.id;
    try {
        // Buscar y eliminar el usuario por su ID
        let usuarioEliminado = await User.findByIdAndDelete(id);
        if (usuarioEliminado) {
            res.status(200).send({ message: 'Usuario eliminado correctamente', data: usuarioEliminado });
        } else {
            res.status(404).send({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error al eliminar el usuario', error });
    }
};
//obtener usuario por ID nomas (para uso de admin)
const obtener_usuario_por_id = async function(req, res) {
    const id = req.params['id'];
    try {
        // Buscar el usuario por ID
        let usuario = await User.findById({_id:id});
        if (usuario) {
            res.status(200).send({ data: usuario });
        } else {
            res.status(404).send({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error al obtener el usuario' + id, error });
    }
};
//mostrar usuario por id y contrasena, (uso para iniciar sesion para cuando se ponga la contra la base de datos)
const obtener_usuario_por_id_y_password = async function(req, res) {
    const { id, password } = req.body;
    try {
        // Buscar usuario por ID
        let usuario = await User.findById(id);
        if (usuario) {
            // Comparar la contraseña
            bcrypt.compare(password, usuario.password, function(err, check) {
                if (check) {
                    res.status(200).send({ data: usuario });
                } else {
                    res.status(400).send({ message: 'La contraseña no coincide' });
                }
            });
        } else {
            res.status(404).send({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error al obtener el usuario', error });
    }
};

const actualizar_usuario = async function(req, res) {
    const id = req.params.id;
    const data = req.body;

    try {
        // Verifica si el campo password está presente en la actualización
        if (data.password) {
            // Si hay un nuevo password, encriptarlo antes de actualizar
            bcrypt.hash(data.password, null, null, async function(err, hash) {
                if (hash) {
                    data.password = hash;
                    // Actualizar el usuario con el password encriptado
                    let usuarioActualizado = await User.findByIdAndUpdate(id, data, { new: true });
                    if (usuarioActualizado) {
                        res.status(200).send({ data: usuarioActualizado });
                    } else {
                        res.status(404).send({ message: 'Usuario no encontrado' });
                    }
                } else {
                    res.status(500).send({ message: 'Error al encriptar la contraseña' });
                }
            });
        } else {
            // Si no hay password, simplemente actualiza el resto de los campos
            let usuarioActualizado = await User.findByIdAndUpdate(id, data, { new: true });
            if (usuarioActualizado) {
                res.status(200).send({ data: usuarioActualizado });
            } else {
                res.status(404).send({ message: 'Usuario no encontrado' });
            }
        }
    } catch (error) {
        res.status(500).send({ message: 'Error al actualizar el usuario', error });
    }
};

module.exports = {
    login_user,
    registro_usuario,
    listar_usuarios,
    eliminar_usuario,
    obtener_usuario_por_id,
    actualizar_usuario,
    obtener_usuario_por_id_y_password
}