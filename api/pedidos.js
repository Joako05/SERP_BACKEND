const express = require('express');
const router = express.Router();
const {conexion} = require('../bd/conexion');

router.get("/", function(req, res, next){
    const { id } = req.params;
    const sql = "SELECT * FROM pedidos WHERE  = ?";
        conexion.query(sql, [id], function(error, result) {
            if (error)return res.status(500).send("Ocurrió un error");
            res.json({
                status: "ok", 
                Pedido: result 
            });
        });
})

router.post("/", function (req, res, next){
    const { id_usuario, fecha, total, estado} = req.body;
        
    const sql = `INSERT INTO pedidos (id_usuario, fecha, total, estado) VALUES (?, ?, ?, ? )`
        
        conexion.query(sql, [id_usuario, fecha, total, estado], function(error, result){
                if (error) {
                    console.error(error);
                    return res.send("Ocurrio un error");
                }
                res.json({status:"ok"})
        })
})

router.put("/", function(req, res, next){
    const { id_pedido } = req.query;
    const {id_usuario, fecha, total, estado} = req.body;

    const sql = `UPDATE pedidos SET id_usuario = ?, fecha = ?, total = ?, estado = ?  WHERE id_pedido = ?`;
    conexion.query(
        sql,
        [id_usuario, fecha, total, estado],
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

    const sql = "DELETE FROM pedidos WHERE id_pedido = ?";

    conexion.query(sql, [id_pedido], function(error, result){
        if(error) {
            console.error(error);
            return res.status(500).send("Ocurrio un error");
        }
        res.json({status:"ok"})
    })
})

module.exports = router;