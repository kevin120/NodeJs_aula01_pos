const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();

const UserModel = mongoose.model('User');
const passport = require('passport');

router.get('/', async (req, res, next) => {
    try {
        const users = await UserModel.find().
            select('name username acesso');
        res.status(200).json({
            count: users.length,
            users: users.map(user => {
                return {
                    name: user.name,
                    username: user.username,
                    acesso: user.acesso,
                    _id: user._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/users/' + user._id
                    }
                }
            })
        })
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.post('/signup', async (req, res, next) => {
    try {
        let user = new UserModel({});
        user.username = req.body.username;
        user.name = req.body.name;
        //password: req.body.password
        user.setPassword(req.body.password);
        user.acesso = req.body.acesso;

        user = await user.save();
        res.status(201).json({
          message: 'Created user successfully',
          createdUser: {
              username: user.username,
              _id: user._id,
              request: {
                  type: "GET",
                  url: "http://localhost:3000/users/" + user._id
              }
          }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        
        passport.authenticate('local', function(err, user, info) {
            if (err){return next(err);}
                
            if (user) {
                return res.status(200).json({token: user.generateJWT()})
            } else {
                return res.status(401).json(info);
            }
        })(req, res, next)
        
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});


router.get('/:userId', async (req, res, next) => {
    try {
        const id = req.params.userId
        const user = await UserModel.findOne({ _id: id }).select('name username acesso')

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(440).json({
                message: 'Usuário não existe!'
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }

});


router.delete('/:userId', async (req, res, next) => {
    try {
        const id = req.params.userId;

        let status = await UserModel.deleteOne({ _id: id });

        res.status(200).json({
            message: 'Usuario deletado',
            status: status
        })
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});


module.exports = router;