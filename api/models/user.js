const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    username: {type:  String, lowercase: true, unique: true, required: true},
    hash: {type: String},
    salt: {type: String},
    acesso: {type: String, required:true},
},
{
    timestamps: true
});

userSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');

    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1').toString('hex');
}

userSchema.methods.validPassword = function (password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1').toString('hex');

    return this.hash === hash;
}

userSchema.methods.generateJWT = function () {
    let exp = new Date(new Date().getDate() + 60);

    return jwt.sign({
        _id: this._id,
        username: this.username,
        exp: parseInt(exp.getTime()/1000)},
        'SECRET'
    );
}

mongoose.model('User', userSchema);