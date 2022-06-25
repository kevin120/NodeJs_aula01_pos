const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, err => {
        if (err) throw err;
        console.log('Connect to MongoDB!!!');
    });

require('./api/models/product');
require('./api/models/order');

const app = express();

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

let cors = (req, res, next) => {
    const whitelist = [
        'http://localhost:8080'
    ];

    const origin = req.header.origin;
    if (whitelist.indexOf(origin) > -1 ) {
        res.setHeader('Access-Control-Allow-Methods', '*');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, POST, DELETE');
    res.setHeader('Access-Control-Allow-Methods', 'TOKEN, Content-Type, Authorization, x-access-token');
    next();
}
app.use(cors);

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.use('/api', (req, res, next) => {
    res.status(200).json({
        message: 'Hello World!'
    })
});

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) =>{
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});

module.exports = app;

