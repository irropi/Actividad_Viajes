var express = require('express'); //llamamos express
var router = express.Router(); // llamamos al router de express
const UserModel = require('../models/user'); // llamamos al modelo del Usuario

router.post('/signup', function (req, res, next) { //definimos un endpoint para registrar el usuario
  new UserModel({ // creamos un usuario basándonos en el módelo de mongoose
      ...req.body // le pasamos el form data que viene en el body de la petición 
    }).save() // guardamos en la base de datos el usuario creado a partir del módelo de mongoose
    .then(user => res.status(201).send(user)) // si todo va bien devolvemos el usuario como respuesta a la petición
    .catch(res.send) // en caso de error devolvemos el error como respuesta a la petición 
});

module.exports = router; //exportamos el router para llamarlo en la app.js