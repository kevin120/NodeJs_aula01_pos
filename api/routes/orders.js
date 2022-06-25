const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();

const OrderModel = mongoose.model('Order');
const ProductModel = mongoose.model('Product');

router.get('/', async (req, res, next) => {
    try {
        const orders = await OrderModel.find({}).populate('product');
        res.status(200).json({
            count: orders.length,
            orders: orders.map(order => {
                return {
                    product: order.product,
                    quantity: order.quantity,
                    _id: order.id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + order.id
                    }
                }
            })
        })
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        let product = null;
        try {
            product = await ProductModel.findOne({ _id: req.body.productId });
            if (!product) {
                res.status(404).json({ message: 'Produto não existe' });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }

        if (product) {
            let order = new OrderModel({
                product: req.body.productId,
                quantity: req.body.quantity
            });

            order = await order.save();

            res.status(201).json({
                message: 'Ordem Criada com Sucesso!',
                createOrder: {
                    product: order.product,
                    quantity: order.quantity,
                    _id: order._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + order.id
                    }
                }
            })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.get('/:orderId', async (req, res, next) => {
    const id = req.params.orderId;
    try {
        const order = await OrderModel.findOne({ _id: id })
            .populate('product');
        if (order) {
            res.status(200).json({
                order: order,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/' + order.id
                }
            })

        } else {
            res.status(404).json('Ordem não existe');
        }

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.patch('/:orderId', async (req, res, next) => {
    const id = req.params.orderId;
    res.status(200).json({
        message: 'Update order',
        id: id
    })
});

router.delete('/:orderId', async (req, res, next) => {
    const id = req.params.orderId;
    try {
        const status = await OrderModel.deleteOne({ _id: id });

        res.status(200).json({
            message: 'delete order',
            id: status
        })
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;