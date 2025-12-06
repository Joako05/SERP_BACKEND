const express = require('express');
const router = express.Router();
const { conexion } = require('../bd/conexion');


// GET todos los pedidos
router.get("/", (req, res) => {
    const sql = "SELECT * FROM pedidos";

    conexion.query(sql, (error, result) => {
        if (error) return res.status(500).json({ status: "error", error: "Ocurrió un error" });

        res.json({ status: "ok", pedidos: result });
    });
});


// GET pedido por id
router.get("/:id", (req, res) => {
    const { id } = req.params;

    const sql = "SELECT * FROM pedidos WHERE id_pedido = ?";

    conexion.query(sql, [id], (error, result) => {
        if (error) return res.status(500).json({ status: "error", error: "Ocurrió un error" });
        if (result.length === 0) return res.status(404).json({ status: "error", error: "Pedido no encontrado" });

        res.json({ status: "ok", pedido: result[0] });
    });
});


router.post("/", (req, res) => {
    const { id_usuario, total } = req.body;

    if (!id_usuario || !total) {
        return res.status(400).json({ status: "error", error: "Faltan campos" });
    }

    const sql = `
        INSERT INTO pedidos (id_usuario, fecha, total)
        VALUES (?, NOW(), ?)
    `;

    conexion.query(sql, [id_usuario, total], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ status: "error", error: "Ocurrió un error" });
        }

        res.json({ status: "ok", id_pedido: result.insertId });
    });
});


// PUT actualizar pedido
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { id_usuario, fecha, total } = req.body;

    const sql = "UPDATE pedidos SET id_usuario = ?, fecha = ?, total = ? WHERE id_pedido = ?";

    conexion.query(sql, [id_usuario, fecha, total, id], (error, result) => {
        if (error) return res.status(500).json({ status: "error", error: "Ocurrió un error" });

        if (result.affectedRows === 0)
            return res.status(404).json({ status: "error", error: "Pedido no encontrado" });

        res.json({ status: "ok" });
    });
});


// DELETE pedido
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM pedidos WHERE id_pedido = ?";

    conexion.query(sql, [id], (error, result) => {
        if (error) return res.status(500).json({ status: "error", error: "Ocurrió un error" });

        if (result.affectedRows === 0)
            return res.status(404).json({ status: "error", error: "Pedido no encontrado" });

        res.json({ status: "ok" });
    });
});

module.exports = router;
