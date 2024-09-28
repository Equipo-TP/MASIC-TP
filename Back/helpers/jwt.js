'use strict'

var jwt = require('jwt-simple');
//creamos la variable moment para hacer referencia a la fecha de creación y expiración
var moment = require('moment');
//la variable secret es para que el token lleve una variable secreta, puede ser cualquier nombre
var secret = 'valery';

exports.createToken = function(user) {
    var payload = {
        _id: user._id,
        nombres: user.nombres,
        apellidos: user.apellidos,
        email: user.email,
        iat: moment().unix(),
        exp: moment().add(5, 'days').unix()
    }
    return jwt.encode(payload, secret);
}