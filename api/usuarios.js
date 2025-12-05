const router = require('express').Router();
const {hashPass, verificarPass, generarToken} = require('@damianegreco/hashpass');
const {conexion} = require('../bd/conexion');
const TOKEN_SECRET = "ollas";

const checkUsuario = (nombre) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT id_usuario FROM usuarios WHERE nombre = ?";
        conexion.query(sql, [nombre], (error, result) => {
            if (error) return reject(error);
            if (result.length > 0) return reject("Usuario ya registrado");
            resolve();
        });
    });
};

const guardarUsuario = (nombreUsu, passHasheada) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO usuarios (nombre, apellido, correo, contraseña, telefono, direccion, rol) VALUE (?, ?, ?, ?, ?, ?, ?)";
        conexion.query(sql, [nombre, passHasheada], (error, result) => {
            if (error) return reject(error);
            resolve(result.insertId);
        });
    });
};

router.post('/', (req, res) => {
    const {nombre, apellido, correo, contraseña, telefono, direccion, rol} = req.body;

    checkUsuario(nombre)
        .then(() => {
            const passHasheada = hashPass(contraseña);
            return guardarUsuario(nombre, passHasheada);
        })
        .then((id_usuario) => res.json({status: 'ok', id_usuario}))
        .catch((error) => {
            console.error(error);
            res.json({status: 'error', error});
        });
});

router.post('/login', (req, res) => {
    const {nombreUsu, contraseña} = req.body;

    const sql = 'SELECT id_usuario, nombre, apellido, correo, contraseña, telefono, direccion, rol FROM usuarios WHERE nombre = ?';
    conexion.query(sql, [nombre], (error, result) => {
        if (error) {
            console.error(error);
            return res.json({status: 'error', error});
        }
        if (result.length === 0) {
            return res.json({status: 'error', error: "Usuario no existe"});
        }
        const usuario = result[0];
        if (verificarPass(contraseña, usuario.contraseña)) {
            const token = generarToken(TOKEN_SECRET, 6, {usuario_id: usuario.id_usuario, usuario: nombre});
            res.json({status: 'ok', token});
        } else {
            res.json({status: 'error', error: "Usuario/contraseña incorrecta"});
        }
    });
});

module.exports = router;
