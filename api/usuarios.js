const express = require('express');
const router = express.Router();
const { hashPass, verificarPass, generarToken } = require('@damianegreco/hashpass');
const { conexion } = require('../bd/conexion');

const TOKEN_SECRET = "ollas";


// ---------------------------------------------------
// GET: todos los usuarios (solo admin)
// ---------------------------------------------------
router.get("/", (req, res) => {
    const sql = "SELECT id_usuario, nombre, apellido, correo, telefono, direccion, rol FROM usuarios";

    conexion.query(sql, (err, result) => {
        if (err) return res.status(500).json({ status: "error", error: "Ocurrió un error" });

        res.json({ status: "ok", usuarios: result });
    });
});


// ---------------------------------------------------
// GET usuario por id
// ---------------------------------------------------
router.get("/:id", (req, res) => {
    const { id } = req.params;

    const sql = "SELECT * FROM usuarios WHERE id_usuario = ?";

    conexion.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ status: "error", error: "Ocurrió un error" });
        if (result.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });

        res.json({ status: "ok", usuario: result[0] });
    });
});


// ---------------------------------------------------
// POST registro
// ---------------------------------------------------
router.post("/", (req, res) => {
    const { nombre, apellido, correo, contraseña, telefono, direccion, rol } = req.body;

    // verificar duplicado
    conexion.query("SELECT id_usuario FROM usuarios WHERE correo = ?", [correo], (err, result) => {
        if (err) return res.status(500).json({ error: "Error interno" });

        if (result.length > 0) {
            return res.status(400).json({ status: "error", error: "Correo ya registrado" });
        }

        const passHash = hashPass(contraseña);

        const sql = `INSERT INTO usuarios 
            (nombre, apellido, correo, contraseña, telefono, direccion, rol)
            VALUES (?, ?, ?, ?, ?, ?, ?)`;

        conexion.query(sql, [nombre, apellido, correo, passHash, telefono, direccion, rol], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ status: "error", error: "Ocurrió un error" });
            }

            res.json({ status: "ok", id_usuario: result.insertId });
        });
    });
});


// ---------------------------------------------------
// POST login
// ---------------------------------------------------
router.post("/login", (req, res) => {
    const { correo, contraseña } = req.body;

    const sql = "SELECT * FROM usuarios WHERE correo = ?";

    conexion.query(sql, [correo], (err, result) => {
        if (err) return res.status(500).json({ status: "error", error: "Ocurrió un error" });

        if (result.length === 0) {
            return res.status(400).json({ status: "error", error: "Usuario no existe" });
        }

        const usuario = result[0];

        if (!verificarPass(contraseña, usuario.contraseña)) {
            return res.status(400).json({ status: "error", error: "Contraseña incorrecta" });
        }

        const token = generarToken(TOKEN_SECRET, 6, {
            id_usuario: usuario.id_usuario,
            correo: usuario.correo,
            rol: usuario.rol
        });

        res.json({ status: "ok", token });
    });
});


// ---------------------------------------------------
// PUT actualizar usuario
// ---------------------------------------------------
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, telefono, direccion, rol } = req.body;

    const sql = `UPDATE usuarios
                 SET nombre = ?, apellido = ?, telefono = ?, direccion = ?, rol = ?
                 WHERE id_usuario = ?`;

    conexion.query(sql, [nombre, apellido, telefono, direccion, rol, id], (err, result) => {
        if (err) return res.status(500).json({ status: "error", error: "Ocurrió un error" });

        if (result.affectedRows === 0)
            return res.status(404).json({ status: "error", error: "Usuario no encontrado" });

        res.json({ status: "ok" });
    });
});


// ---------------------------------------------------
// DELETE usuario
// ---------------------------------------------------
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM usuarios WHERE id_usuario = ?";

    conexion.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ status: "error", error: "Ocurrió un error" });

        if (result.affectedRows === 0)
            return res.status(404).json({ error: "Usuario no encontrado" });

        res.json({ status: "ok" });
    });
});

module.exports = router;
