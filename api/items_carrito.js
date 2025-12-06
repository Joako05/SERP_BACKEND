const express = require('express');
const router = express.Router();
const { conexion } = require('../bd/conexion');


// GET todos
router.get("/", (req, res) => {
    conexion.query("SELECT * FROM item_carrito", (err, result) => {
        if (err) return res.status(500).json({ status: "error", error: "Ocurrió un error" });
        res.json({ status: "ok", items: result });
    });
});


// GET por id
router.get("/:id", (req, res) => {
    const { id } = req.params;

    const sql = "SELECT * FROM item_carrito WHERE id_item = ?";

    conexion.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ status: "error", error: "Ocurrió un error" });
        if (result.length === 0) return res.status(404).json({ error: "Item no encontrado" });

        res.json({ status: "ok", item: result[0] });
    });
});


// POST crear
router.post("/", (req, res) => {
    const { id_usuario, id_producto, cantidad } = req.body;

    const sql = `INSERT INTO item_carrito (id_usuario, id_producto, cantidad)
                 VALUES (?, ?, ?)`;

    conexion.query(sql, [id_usuario, id_producto, cantidad], (err, result) => {
        if (err) return res.status(500).json({ status: "error", error: "Ocurrió un error" });

        res.json({ status: "ok", id_item: result.insertId });
    });
});


// PUT actualizar
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { id_usuario, id_producto, cantidad } = req.body;

    const sql = `UPDATE item_carrito 
                SET id_usuario = ?, id_producto = ?, cantidad = ?
                WHERE id_item = ?`;

    conexion.query(sql, [id_usuario, id_producto, cantidad, id], (err, result) => {
        if (err) return res.status(500).json({ status: "error", error: "Ocurrió un error" });

        if (result.affectedRows === 0)
            return res.status(404).json({ error: "Item no encontrado" });

        res.json({ status: "ok" });
    });
});


// DELETE
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM item_carrito WHERE id_item = ?";

    conexion.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ status: "error", error: "Ocurrió un error" });

        if (result.affectedRows === 0)
            return res.status(404).json({ error: "Item no encontrado" });

        res.json({ status: "ok" });
    });
});

module.exports = router;
