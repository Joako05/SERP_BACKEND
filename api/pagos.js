const express = require('express');
const router = express.Router();
const { conexion } = require('../bd/conexion');

// POST /api/pagos/simular
router.post('/simular', (req, res) => {
    const { id_pedido, metodo } = req.body;

    if (!id_pedido || !metodo) {
        return res.status(400).json({ status: 'error', error: 'Faltan datos' });
    }

    // Comprobar que el pedido existe y su estado actual
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

        // No permitir pagos si ya esta pagado/enviado/entregado/cancelado
        const estadosInvalidos = ['pagado', 'enviado', 'entregado', 'cancelado'];
        if (estadosInvalidos.includes(pedido.estado)) {
            return res.status(400).json({ status: 'error', error: `No se puede pagar un pedido en estado: ${pedido.estado}` });
        }

        // Actualizar pedido a pagado y guardar el metodo de pago
        const sqlUpdate = `UPDATE pedidos SET estado = 'pagado', metodo_pago = ? WHERE id_pedido = ?`;
        conexion.query(sqlUpdate, [metodo, id_pedido], (err2, result) => {
            if (err2) {
                console.error(err2);
                return res.status(500).json({ status: 'error', error: 'Error al procesar pago simulado' });
            }
            return res.json({
                status: 'ok',
                mensaje: 'Pago simulado aprobado',
                id_pedido
            });
        });
    });
});

module.exports = router;
