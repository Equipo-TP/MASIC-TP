'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'valery';

exports.auth = function(req,res,next){
    if (!req.headers.authorization) {
        return res.status(403).send({message: 'NoHeadersError'});
    }

    var token = req.headers.authorization.replace(/['"]+/g,'').replace('Bearer ', '');
    console.log('Token recibido:', token);
    var segment = token.split('.');

    if (segment.length != 3) {
        return res.status(403).send({message: 'InvalidToken'});
    }else{
        try {
            var payload = jwt.decode(token,secret);
            
            if (payload.exp <= moment.unix()) {
                return res.status(403).send({message: 'TokenExpirado'});
            }
        } catch (error) {
            console.error('Error decodificando el token:', error);
            return res.status(403).send({message: 'InvalidToken'});
        }
    }

    req.user = payload;

    next();
}