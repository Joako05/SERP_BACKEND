const express = require('express');
const router = express.Router();
const {conexion} = require('../bd/conexion');

router.get("/", function(req, res, next){
    const { id } = req.params;
    const sql = "SELECT * FROM items_carrito WHERE  = ?";
        conexion.query(sql, [id], function(error, result) {
            if (error)return res.status(500).send("Ocurrió un error");
            res.json({
                status: "ok", 
                Detalles_de_Pedido: result 
            });
        });
})

router.post("/", function (req, res, next){
    const { id_usuario, id_producto, cantidad } = req.body;
        
    const sql = `INSERT INTO items_carrito (id_usuario, id_producto, cantidad) VALUES (?, ?, ? )`
        
        conexion.query(sql, [id_usuario, id_producto, cantidad], function(error, result){
                if (error) {
                    console.error(error);
                    return res.send("Ocurrio un error");
                }
                res.json({status:"ok"})
        })
})

router.put("/", function(req, res, next){
    const { id_item } = req.query;
    const { id_usuario, id_producto, cantidad} = req.body;

    const sql = `UPDATE items_carrito SET id_usuario = ?, id_producto = ?, cantidad = ?  WHERE id_item = ?`;
    conexion.query(
        sql,
        [id_usuario, id_producto, cantidad],
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

    const sql = "DELETE FROM items_carrito WHERE id_item = ?";

    conexion.query(sql, [id_item], function(error, result){
        if(error) {
            console.error(error);
            return res.status(500).send("Ocurrio un error");
        }
        res.json({status:"ok"})
    })
})

module.exports = router;