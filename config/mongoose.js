const atlasURL = `mongodb+srv://ItsMeMario: esnWzXrEpcqIUDrz @myclusterhasaname-ltkty.mongodb.net/test?retryWrites=true&w=majority`;
const devURL = `mongodb://localhost:27017/ProyectoAgenciaViajes_dev`; 
const url = process.env.NODE_ENV === "production" ? atlasURL :devURL;

const mongoose = require('mongoose');
mongoose.connect( url , {
        useCreateIndex: true,
        useNewUrlParser: true
    })
    .then(() => console.log(`Connected to database mongodb://localhost:27017/ProyectoAgenciaViajes_dev`))
    .catch((error) => console.log('Connection to MongoDB failed!:( \n' + error))

module.exports = mongoose;