const router = require('express').Router();

// Declara variables
const usuariosRouter = require('./usuarios');

const pedidosRouter = require('./pedidos');

const productosRouter = require('./productos');

const carritoRouter = require('./carrito');

const detalleRouter = require('./detalles');

const categoriaRouter = require('./categorias')
 // Routers

 router.use('/usuarios', usuariosRouter);
 router.use('/pedidos', pedidosRouter);
 router.use('/productos', productosRouter);
 router.use('/carrito', carritoRouter);
 router.use('/detalles', detalleRouter );
 router.use('/categorias', categoriaRouter);
