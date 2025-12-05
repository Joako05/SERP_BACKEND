const router = require('express').Router();
const { hashPass, verificarPass, generarToken } = require('@damianegreco/hashpass');
const { conexion } = require('../bd/conexion');

const TOKEN_SECRET = "ollas";

// Verificar si correo ya existe
const checkUsuario = (correo) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT id_usuario FROM usuarios WHERE correo = ?";
        conexion.query(sql, [correo], (error, result) => {
            if (error) return reject(error);
            if (result.length > 0) return reject("Correo ya registrado");
            resolve();
        });
    });
};

// Guardar usuario
const guardarUsuario = (nombre, apellido, correo, passHasheada, telefono, direccion, rol) => {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO usuarios (nombre, apellido, correo, contraseña, telefono, direccion, rol)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        conexion.query(sql, [nombre, apellido, correo, passHasheada, telefono, direccion, rol], (error, result) => {
            if (error) return reject(error);
            resolve(result.insertId);
        });
    });
};


// ----------------------
// 📌 REGISTRO
// ----------------------
router.post('/', (req, res) => {
    const { nombre, apellido, correo, contraseña, telefono, direccion, rol } = req.body;

    checkUsuario(correo)
        .then(() => {
            const passHasheada = hashPass(contraseña);
            return guardarUsuario(nombre, apellido, correo, passHasheada, telefono, direccion, rol);
        })
        .then((id_usuario) => res.json({ status: 'ok', id_usuario }))
        .catch((error) => {
            console.error(error);
            res.json({ status: 'error', error });
        });
});


// ----------------------
// 📌 LOGIN
// ----------------------
router.post('/login', (req, res) => {
    const { correo, contraseña } = req.body;

    const sql = `
        SELECT id_usuario, nombre, apellido, correo, contraseña, telefono, direccion, rol
        FROM usuarios 
        WHERE correo = ?
    `;

    conexion.query(sql, [correo], (error, result) => {
        if (error) {
            console.error(error);
            return res.json({ status: 'error', error });
        }

        if (result.length === 0) {
            return res.json({ status: 'error', error: "Usuario no existe" });
        }

        const usuario = result[0];

        if (verificarPass(contraseña, usuario.contraseña)) {
            const token = generarToken(TOKEN_SECRET, 6, {
                usuario_id: usuario.id_usuario,
                correo: usuario.correo,
                rol: usuario.rol
            });

            res.json({ status: 'ok', token });
        } else {
            res.json({ status: 'error', error: "Usuario/contraseña incorrecta" });
        }
    });
});

module.exports = router;
