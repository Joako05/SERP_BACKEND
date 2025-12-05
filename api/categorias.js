const express = require('express');
const router = express.Router();
const { conexion } = require('../bd/conexion');


// ---------------------------------------------------
// GET: Obtener todas las categorías
// ---------------------------------------------------
router.get("/", (req, res) => {
    const sql = "SELECT * FROM categorias";

    conexion.query(sql, (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ status: "error", error: "Ocurrió un error" });
        }

        res.json({
            status: "ok",
            categorias: result
        });
    });
});


// ---------------------------------------------------
// GET: Obtener categoría por ID
// ---------------------------------------------------
router.get("/:id", (req, res) => {
    const { id } = req.params;

    const sql = "SELECT * FROM categorias WHERE id_categoria = ?";

    conexion.query(sql, [id], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ status: "error", error: "Ocurrió un error" });
        }

        if (result.length === 0) {
            return res.status(404).json({ status: "error", error: "Categoría no encontrada" });
        }

        res.json({
            status: "ok",
            categoria: result[0]
        });
    });
});


// ---------------------------------------------------
// POST: Crear nueva categoría
// ---------------------------------------------------
router.post("/", (req, res) => {
    const { nombre, descripcion } = req.body;

    if (!nombre || !descripcion) {
        return res.status(400).json({ status: "error", error: "Faltan campos" });
    }

    const sql = `INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)`;

    conexion.query(sql, [nombre, descripcion], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ status: "error", error: "Ocurrió un error" });
        }

        res.json({
            status: "ok",
            id_categoria: result.insertId
        });
    });
});


// ---------------------------------------------------
// PUT: Actualizar categoría por ID
// ---------------------------------------------------
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    if (!nombre || !descripcion) {
        return res.status(400).json({ status: "error", error: "Faltan campos" });
    }

    const sql = `UPDATE categorias SET nombre = ?, descripcion = ? WHERE id_categoria = ?`;

    conexion.query(sql, [nombre, descripcion, id], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ status: "error", error: "Ocurrió un error" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ status: "error", error: "Categoría no encontrada" });
        }

        res.json({ status: "ok" });
    });
});


// ---------------------------------------------------
// DELETE: Eliminar categoría por ID
// ---------------------------------------------------
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM categorias WHERE id_categoria = ?";

    conexion.query(sql, [id], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ status: "error", error: "Ocurrió un error" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ status: "error", error: "Categoría no encontrada" });
        }

        res.json({ status: "ok" });
    });
});


module.exports = router;
