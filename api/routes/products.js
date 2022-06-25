const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const ProductModel = mongoose.model('Product');

router.get('/', async (req, res, next) => {
    try {
        const products = await ProductModel.find().
            select('name price _id');
        res.status(200).json({
            count: products.length,
            products: products.map(produto => {
                return {
                    name: produto.name,
                    price: produto.price,
                    _id: produto._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + produto._id
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
        const product = new ProductModel({
            name: req.body.name,
            price: req.body.price
        })

        await product.save();

        res.status(201).json({
            message: 'Produto Criado com Sucesso!',
            productCreated: {
                name: product.name,
                price: product.price,
                _id: product._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + product._id
                }
            }
    })
    } catch (err) {
    console.log(err);
    res.status(500).json(err);
}
});

router.get('/:productId', async (req, res, next) => {
    try {
        const id = req.params.productId
        const product = await ProductModel.findOne({ _id: id })

        if (product) {
            res.status(200).json(product);
        } else {
            res.status(440).json({
                message: 'Produto não existe!'
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }

});

router.patch('/:productId', async (req, res, next) => {
    const id = req.params.productId;

    const updateCampos = {};
    Object.entries(req.body).map(item => {
        console.log(item);
        updateCampos[item[0]] = item[1];
    });

    try {
        let status = await ProductModel.updateOne({ _id: id }, { $set: updateCampos });

        res.status(200).json({
            message: 'Update products',
            status: status,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/products/' + id
            }
        })
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }

});

router.delete('/:productId', async (req, res, next) => {
    try {
        const id = req.params.productId;

        let status = await ProductModel.deleteOne({ _id: id });

        res.status(200).json({
            message: 'delete products',
            status: status
        })
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});


module.exports = router;