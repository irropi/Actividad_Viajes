var express = require('express');
var router = express.Router();
const UserModel = require('../models/user');
const transporter = require('../config/nodemailer');
const jwt = require('jsonwebtoken');
const SECRET_JWT = require('../config/password').SECRET_JWT;
const bcrypt = require("bcrypt");
const uploadPics = require("../config/multer");

/* CREAR EL REGISTRO */
router.post('/signup', function (req, res, next) {

  new UserModel({
      ...req.body,
      confirmedEmail: false
    }).save()
    .then(user => {
      console.log("esto es el usuario ", user)
      const token = jwt.sign({
        _id: user._id
      }, SECRET_JWT, {
        expiresIn: "48h"
      })
      console.log("esto es el token ", token)
      const url = `http://localhost:3000/users/activacion/${token}`
      console.log("esto es la url ", url)
      transporter.sendMail({ // enviamos el email con la siguiente información:
        from: "bootcampstream@gmail.com", // procedencia del email
        to: user.email, // destinatario del email
        subject: "Active su cuenta en nuestra web de viajes", // asunto del email
        html: ` 
       <h1>Bienvenido a nuestra web de viajes</h1>

      <p>Por favor, active su cuenta clicando el siguiente link:
        <a href="${url}">
           Click aquí para activar tu cuenta
        </a>
      </p>
      ` // mensaje en HTML que enviamos al destinatario

      })
      //res.status(201).send("Usuario registrado, por favor confirme su dirección de correo electrónico") // para lleve a una página concreta res.redirect('url')
      res.redirect('/sucess')
    })
    .catch(console.log)
});

router.get('/activacion/:jwt', (req, res) => {
  try {
    const payload = jwt.verify(req.params.jwt, SECRET_JWT)
    console.log("esto es el payload ", payload)
    UserModel.findByIdAndUpdate(payload._id, {
        confirmedEmail: true
      }, {
        new: true
      })
      .then(user => res.send(user))
  } catch (error) {
    res.status(400).send(error)
  }
})


/* CREAR EL LOGIN */

router.post('/login', (req, res) => {
  UserModel.findOne({
    $or: [ // checks if either the username or the email are in the database
      { userName: req.body.usernameEmail },
      { email: req.body.usernameEmail }
    ]
  })
    .then(user => {
      if (!user) return res.status(400).send('USER FAIL'); // if the user/email does not exist in the db responds with this message
      console.log("esto es el usuario ", user)
      if (user.confirmedEmail === false) return res.status(400).send('You have to verify your email'); //if the user exist but the email is not confirmed yet. It responds with this message.
      bcrypt.compare(req.body.password, user.password).then(isMatch => { // the first argument is the plain text password entered by the user, the second argument is the password hash in the db.
        if (!isMatch) return res.status(400).send('PASSWORD FAIL'); // if there is no match between the password entered by the user and the one in the db it responds with "Wrong Credentials"
        const token = user.generateAuthToken(); // calls the method generateAuthToken from the UserModel
        user['token'] = token; // here we create a user property which is going to contain the generated token
        res.json(user); // json can be replaced with send, it does the same. If both the username/email and the password are correct, it responds with the user as a json.
      }).catch(console.log);
      res.redirect('/');
    });
 })

// /* CREAR EL RECOVERY */

// router.post('/recovery', (req, res) => { //se crea la ruta POST en el archivo donde se ejecuta la acción (en este caso, el archivo recovery.hbs)
//   process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; //se trata de un comando para que salte los protocolos de autorización de navegadores y/o anti-virus.
//   let user = UserModel.findOne({ 'email': req.body.email }); // se crea la función 'user' para usarlo en esta ruta en concreto. Se llama a UserModel (creado en ./Model/user) y se le pone la propiedad '.findOne()'(que sirve para que busque un único elemento de dicha función) y dentro de la propiedad se crea un objeto (de ahí los {}) en el que se especifica, primero, una string con el valor que se quiera buscar, y tras dos puntos se pone req.body.email, que hace referencia al email que el usuario pone en el body de la página (de esta manera el programa busca y compara ambos datos para ver si concuerda)
//   if (!user) return res.status(400).send('this email is not register'); // Se crea un condicional en el que, si el usuario es null/false (es decir, que el elemento email no concuerda con ningún elemento del UserModel) devolverá un mensaje de tipo 400 cuyo contenido será 'este email no está registrado'
//   console.log('usuario',user);
  
//   const token = jwt.sign({ email: req.body.email }, SECRET_JWT, { expiresIn: "48h" }) // Aquí se crea un token (o marca). Para ello primero se crea una const con la palabra 'token'para identificarlo y se crea el jwt* y se le añade la propiedad '.sign' (en donde indicarias el payload (o el atributo que define el token, es decir, lo que se quiere extraer) , secret Or PrivateKey (que sería el código secreto para encriptar al usuario) y la  callback( que sería, en este caso, el tiempo de caducidad del token).
//   console.log("esto es el token ", token)
//   const url = `http://localhost:3000/users/recoveryPass/${token}` // se crea una variable 'url' para que, cuando comencemos a realizar toda la lógica, no haga falta repetir todo el rato la url, unicamente hay que llamarla. Se usa el ${} debido a que al ser una template String se puede usar esto para llamar a funciones y variables dentro de una String. 
//   console.log("esto es la url ", url)
//   transporter.sendMail({ //enviamos el email con la siguiente información:
//     from: "bootcampstream@gmail.com", //procedencia del email
//     to: req.body.email, // destinatario del email. Se debe poner req.body.email porque así coincidirá siempre con el email que el usuario ha escrito en el input.
//     subject: "Reactive su contraseña", //asunto del email
//     html: ` 
//      <h1>Recupere su contraseña</h1>

//     <p>Por favor, para cambiar su contraseña pulse el siguiente link:
//       <a href="${url}">
//          Click aquí para activar tu cuenta
//       </a>
//     </p>
//     ` //mensaje en HTML que enviamos al destinatario

//   }).then(res.render('pass')) //se crea una promesa en la cual la respuesta (res) es que se renderice con el '.render'(es decir, que lo pinte en la pantalla del usuario). A continuación se tiene que poner en String la página .hbs a la que se quiere enviar al usuario mientras se envía el correo, ya que aquí se está haciendo una operación asíncrona y, por lo tanto, lo hace a la vez de enviar el email.
//   .catch(console.log)

// })
// router.get('/recoveryPass/:token', (req, res) => { //se crea una ruta GET en la cual se redirige al usuario a esta página creada en .hbs (dicha página se ha tenido que incluir dentro de la url enviada en el email) y se añade el token del usuario.
//   res.render('recoveryPass') // se crea la respuesta (res), es decir, que se renderice con el '.render'o se pinte en la pantalla del usuario). A continuación se tiene que poner en String la página .hbs a la que se quiere enviar al usuario.
// })
// router.post('/resetPass2', (req, res) => { // se crea una ruta de POST en donde se envía la orden de buscar la contraseña y sustituirla con un split. Primero se redirigirá al usuario al archivo .hbs que se ponga al principio (en este caso '/resetPass2') y luego se realiza la callback en donde se creará toda la lógica para cambiar la contraseña.
//   const token = req.headers.referer /* se crea la token para buscar la contraseña. Esta formado por la req(require).headers(el primer fragmento del jwt, es decir, lo que está antes del primer punto).referer*/
//   split(`http://localhost:3000/users/resetPass1/${token}`)  //sacas el token
//   // const email=jwt.verify(token,SECRET_JWT)
//   // UserModel.findOneAndUpdate({email},{password:req.body.password})
// })
// router.get('/recoveryPass/:token', function (req, res) {
//   const token = req.params.token;
//   res.render('recoveryPass', {
//     id_token: token,
//   })
// })

// router.post('/recoveryPass/users/submitPass/:token', function (req, res, next) {
//   const token = req.params.token;
//   const pass = req.body.password;
//   let newPass = '';
//   bcrypt.genSalt(pass.length)
//     .then(salt => bcrypt.hash(pass, salt)
//       .then(hash => {
//         newPass = hash;
//         try {
//           const payload = jwt.verify(token, SECRET_JWT)

//           UserModel.findByIdAndUpdate(payload._id, {
//             password: newPass
//           }, {
//               new: true
//             })
//             .then(user => res.render('passGoHome', {}))
//           // .then(user => res.send(user))//
//         } catch (error) {
//           res.status(400).send(error)
//         }

//       }))
//     .catch(error => res.status(500).send(error))
// });


router.post("/uploadImage", uploadPics.single("avatar"),(req, res)=>{
  res.send(req.file.filename)
})

module.exports = router;

/* *Json Web Token: Está compuesto por 3 strings separados por un punto '.' . Cada string significa una cosa:

- Header La primera parte es la cabecera del token, que a su vez tiene otras dos partes, el tipo, en este caso un JWT y la codificación utilizada. Comunmente es el algoritmo HMAC SHA256.
- Payload: EL Payload está compuesto por los llamados JWT Claims donde irán colocados la atributos que definen nuestro token. Exiten varios que puedes consultar aquí, los más comunes a utilizar son:
  - sub: Identifica el sujeto del token, por ejemplo un identificador de usuario.
  - iat: Identifica la fecha de creación del token, válido para si queremos ponerle una fecha de caducidad. En formato de tiempo UNIX.
  - exp: Identifica a la fecha de expiración del token. Podemos calcularla a partir del iat. También en formato de tiempo UNIX.
- Signature: La firma es la tercera y última parte del JSON Web Token. Está formada por los anteriores componentes (Header y Payload) cifrados en Base64 con una clave secreta (almacenada en nuestro backend). Así sirve de Hash para comprobar que todo está bien.*/