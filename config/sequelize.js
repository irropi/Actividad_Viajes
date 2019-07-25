const Sequelize = require("sequelize");

const connection = new Sequelize("webtravelagency", "root", "", { // ("base de datos", "usuario", "contraseña")
    host: "localhost",
    dialect: "mysql",
    operatorAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
})

connection.authenticate()
.then(()=>console.log("My SQL connection has been established succesfully."))
.catch(err=>console.error("Unable to connect to the SQL database", err)) 

module.exports = connection;