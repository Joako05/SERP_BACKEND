const express = require('express');
const router = express.Router();
const {conexion} = require('../bd/conexion');

router.get("/", function(req, res, next){
    const { id } = req.params;
    const sql = "SELECT * FROM detalle_pedido WHERE  = ?";
        conexion.query(sql, [id], function(error, result) {
            if (error)return res.status(500).send("Ocurrió un error");
            res.json({
                status: "ok", 
                Detalles_de_Pedido: result 
            });
        });
})

router.post("/", function (req, res, next){
    const { id_pedido, id_producto, cantidad, precio_unitario } = req.body;
        
    const sql = `INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ? )`
        
        conexion.query(sql, [id_pedido, id_producto, cantidad, precio_unitario], function(error, result){
                if (error) {
                    console.error(error);
                    return res.send("Ocurrio un error");
                }
                res.json({status:"ok"})
        })
})

router.put("/", function(req, res, next){
    const { id_detalle } = req.query;
    const { id_pedido, id_producto, cantidad, precio_unitario } = req.body;

    const sql = `UPDATE detalle_pedido SET id_pedido = ?, id_producto = ?, cantidad = ?, precio_unitario = ?  WHERE id_detalle = ?`;
    conexion.query(
        sql,
        [id_pedido, id_producto, cantidad, precio_unitario],
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

    const sql = "DELETE FROM detalle_pedido WHERE id_detalle = ?";

    conexion.query(sql, [id_detalle], function(error, result){
        if(error) {
            console.error(error);
            return res.status(500).send("Ocurrio un error");
        }
        res.json({status:"ok"})
    })
})

module.exports = router;