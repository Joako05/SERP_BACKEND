const express = require('express');
const router = express.Router();
const { conexion } = require('../bd/conexion');


// GET todos
router.get("/", (req, res) => {
    conexion.query("SELECT * FROM detalle_pedidos", (err, result) => {
        if (err) return res.status(500).json({ status: "error", error: "Ocurrió un error" });
        res.json({ status: "ok", detalle: result });
    });
});


// GET por id
router.get("/:id", (req, res) => {
    const { id } = req.params;

    const sql = "SELECT * FROM detalle_pedidos WHERE id_detalle = ?";

    conexion.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ status: "error", error: "Ocurrió un error" });
        if (result.length === 0) return res.status(404).json({ error: "Detalle no encontrado" });

        res.json({ status: "ok", detalle: result[0] });
    });
});


// POST crear
router.post("/", (req, res) => {
    const { id_pedido, id_producto, cantidad, precio_unitario } = req.body;

    const sql = `INSERT INTO detalle_pedidos 
                (id_pedido, id_producto, cantidad, precio_unitario)
                VALUES (?, ?, ?, ?)`;

    conexion.query(sql, [id_pedido, id_producto, cantidad, precio_unitario], (err, result) => {
        if (err) return res.status(500).json({ status: "error", error: "Ocurrió un error" });
        res.json({ status: "ok", id_detalle: result.insertId });
    });
});


// PUT actualizar
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { id_pedido, id_producto, cantidad, precio_unitario } = req.body;

    const sql = `UPDATE detalle_pedidos
                 SET id_pedido = ?, id_producto = ?, cantidad = ?, precio_unitario = ?
                 WHERE id_detalle = ?`;

    conexion.query(sql, [id_pedido, id_producto, cantidad, precio_unitario, id], (err, result) => {
        if (err) return res.status(500).json({ status: "error", error: "Ocurrió un error" });
        if (result.affectedRows === 0) return res.status(404).json({ error: "Detalle no encontrado" });

        res.json({ status: "ok" });
    });
});


// DELETE
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM detalle_pedidos WHERE id_detalle = ?";

    conexion.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ status: "error", error: "Ocurrió un error" });

        if (result.affectedRows === 0)
            return res.status(404).json({ error: "Detalle no encontrado" });

        res.json({ status: "ok" });
    });
});

module.exports = router;
