const express = require('express');
const router = express.Router();
const {conexion} = require('../bd/conexion');

router.get("/", function(req, res, next){
    const { id } = req.params;
    const sql = "SELECT * FROM categorias WHERE  = ?";
        conexion.query(sql, [id], function(error, result) {
            if (error)return res.status(500).send("Ocurrió un error");
            res.json({
                status: "ok", 
                Categorias: result 
            });
        });
})

router.post("/", function (req, res, next){
    const { nombre, descripcion } = req.body;
        
    const sql = `INSERT INTO categorias (nombre, descripcion ) VALUES (?, ?)`
        
        conexion.query(sql, [nombre, descripcion], function(error, result){
                if (error) {
                    console.error(error);
                    return res.send("Ocurrio un error");
                }
                res.json({status:"ok"})
        })
})

router.put("/", function(req, res, next){
    const { id_categoria } = req.query;
    const { nombre, descripcion } = req.body;

    const sql = `UPDATE categorias SET nombre = ?, descripcion = ?  WHERE id_categoria = ?`;
    conexion.query(
        sql,
        [nombre, descripcion],
        function(error,result){
            if (error) {
                console.error(error);
                res.status(500).send("ocurrio un error")
            } 
            res.json({status:"ok"})
        }
    )
})

router.delete("/", function(req, res, next){
    const { id } = req.query;

    const sql = "DELETE FROM categorias WHERE id_categoria = ?";

    conexion.query(sql, [idPersona], function(error, result){
        if(error) {
            console.error(error);
            return res.status(500).send("Ocurrio un error");
        }
        res.json({status:"ok"})
    })
})

module.exports = router;