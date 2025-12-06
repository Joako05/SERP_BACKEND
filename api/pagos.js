const express = require('express');
const router = express.Router();
const { conexion } = require('../bd/conexion');
// si usás autenticación JWT, usá un middleware que decodifique y ponga req.user

// POST /api/pagos/simular
router.post('/simular', (req, res) => {
    const { id_pedido, metodo } = req.body;
    // opcional: si usás token -> const usuario_id = req.user.id_usuario;

    if (!id_pedido || !metodo) {
        return res.status(400).json({ status: 'error', error: 'Faltan datos' });
    }

    // 1) Comprobar que el pedido existe y su estado actual
    const sqlSelect = 'SELECT id_pedido, id_usuario, estado FROM pedidos WHERE id_pedido = ?';
    conexion.query(sqlSelect, [id_pedido], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ status: 'error', error: 'Error interno' });
        }
        if (rows.length === 0) {
            return res.status(404).json({ status: 'error', error: 'Pedido no encontrado' });
        }

        const pedido = rows[0];

        // Opcional: validar que el usuario del token sea propietario del pedido
        // if (req.user && req.user.id_usuario !== pedido.id_usuario) { ... }

        // No permitir pagos si ya está pagado/enviado/entregado/cancelado
        const estadosInvalidos = ['pagado', 'enviado', 'entregado', 'cancelado'];
        if (estadosInvalidos.includes(pedido.estado)) {
            return res.status(400).json({ status: 'error', error: `No se puede pagar un pedido en estado: ${pedido.estado}` });
        }

        // 2) Actualizar pedido a pagado (simulado) y guardar método
        const sqlUpdate = `UPDATE pedidos SET estado = 'pagado', metodo_pago = ? WHERE id_pedido = ?`;
        conexion.query(sqlUpdate, [metodo, id_pedido], (err2, result) => {
            if (err2) {
                console.error(err2);
                return res.status(500).json({ status: 'error', error: 'Error al procesar pago simulado' });
            }

            // 3) (Opcional) Vaciado del carrito o acciones posteriores:
            // conexion.query('DELETE FROM item_carrito WHERE id_usuario = ?', [pedido.id_usuario], ...)

            return res.json({
                status: 'ok',
                mensaje: 'Pago simulado aprobado',
                id_pedido
            });
        });
    });
});

module.exports = router;
