const connection = require("../config/sequelize");
const Sequelize = require("sequelize");

const destination = connection.define("destination", {
    destination: Sequelize.STRING,
})

destination.sync({
    logging: console.log
}).then(() => {
    console.log("destination model synchronized with destination table")
}).catch(console.log(err => "Error al sincronizar: " + err))

module.exports = destination;