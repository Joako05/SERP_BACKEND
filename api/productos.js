const express = require('express');
const router = express.Router();
const { conexion } = require('../bd/conexion');


// GET: Obtener todos los productos
router.get("/", (req, res) => {
    const sql = "SELECT * FROM productos";

    conexion.query(sql, (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ status: "error", error: "Ocurrió un error" });
        }

        res.json({ status: "ok", productos: result });
    });
});


// GET: Obtener producto por id
router.get("/:id", (req, res) => {
    const { id } = req.params;

    const sql = "SELECT * FROM productos WHERE id_producto = ?";

    conexion.query(sql, [id], (error, result) => {
        if (error) return res.status(500).json({ status: "error", error: "Ocurrió un error" });

        if (result.length === 0) {
            return res.status(404).json({ status: "error", error: "Producto no encontrado" });
        }

        res.json({ status: "ok", producto: result[0] });
    });
});


// POST: Crear producto
router.post("/", (req, res) => {
    const { nombre, descripcion, precio, stock, id_categoria } = req.body;

    if (!nombre || !descripcion || !precio || !stock || !id_categoria) {
        return res.status(400).json({ status: "error", error: "Faltan campos" });
    }

    const sql = `INSERT INTO productos (nombre, descripcion, precio, stock, id_categoria)
                 VALUES (?, ?, ?, ?, ?)`;

    conexion.query(sql, [nombre, descripcion, precio, stock, id_categoria], (error, result) => {
        if (error) return res.status(500).json({ status: "error", error: "Ocurrió un error" });

        res.json({ status: "ok", id_producto: result.insertId });
    });
});


// PUT: Actualizar producto por iud
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, id_categoria } = req.body;

    const sql = `UPDATE productos
                 SET nombre = ?, descripcion = ?, precio = ?, stock = ?, id_categoria = ?
                 WHERE id_producto = ?`;

    conexion.query(sql, [nombre, descripcion, precio, stock, id_categoria, id], (error, result) => {
        if (error) return res.status(500).json({ status: "error", error: "Ocurrió un error" });

        if (result.affectedRows === 0) {
            return res.status(404).json({ status: "error", error: "Producto no encontrado" });
        }

        res.json({ status: "ok" });
    });
});


// DELETE Eliminar producto por id
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM productos WHERE id_producto = ?";

    conexion.query(sql, [id], (error, result) => {
        if (error) return res.status(500).json({ status: "error", error: "Ocurrió un error" });

        if (result.affectedRows === 0) {
            return res.status(404).json({ status: "error", error: "Producto no encontrado" });
        }

        res.json({ status: "ok" });
    });
});

module.exports = router;
