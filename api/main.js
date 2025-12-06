const router = require('express').Router();

// Importar subrutas
const usuariosRouter = require('./usuarios');
const pedidosRouter = require('./pedidos');
const productosRouter = require('./productos');
const carritoRouter = require('./items_carrito');
const detalleRouter = require('./detalle_pedido');
const categoriaRouter = require('./categorias');
const pagosRouter = require('./pagos');

// Usar subrouters
router.use('/usuarios', usuariosRouter);
router.use('/pedidos', pedidosRouter);
router.use('/productos', productosRouter);
router.use('/carrito', carritoRouter);
router.use('/detalles', detalleRouter);
router.use('/categorias', categoriaRouter);
router.use('/pagos', pagosRouter);

// Exportar router
module.exports = router;
