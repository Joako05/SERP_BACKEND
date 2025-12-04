const mysql = require ('mysql2');
const conexion = mysql.createConnection({

    host:"localhost",
    user:"root",
    password:"",
    database:"royalprestige",

});

conexion.connect(function(error){
    if (error){
        console.error(error);
        return;
    }

    console.log("conectado exitosamente a la db");
} )

module.exports = { conexion }