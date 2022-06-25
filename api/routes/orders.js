const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();

const OrderModel = mongoose.model('Order');

router.get('/', async (req, res, next) => {
    try {
        const orders = await OrderModel.find({});
        res.status(200).json({
            count: orders.length,
            orders: orders.map(order => {
                return {
                    product: order.product_id,
                    quantity: order.quantity,
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
        let order = new OrderModel({
            product_id: req.body.product_id,
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
    res.status(200).json({
        message: 'delete order',
        id: id
    })
});

module.exports = router;