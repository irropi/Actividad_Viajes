const mongoose = require('mongoose');
const {
    isEmail
} = require('validator');
const bcrypt = require('bcrypt');
const SALT = 10;
const jwt = require('jsonwebtoken');
const SECRET_AUTH_JWT = require

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        maxlength: 40,
    },
    lastname: String,
    email: {
        type: String,
        unique: true,
        validate: function (email) {
            return new Promise(function (resolve) {
                setTimeout(function () {
                    resolve(isEmail(email));
                }, 5);
            });
        },

    },
    username: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        minlength: 8,
    },
    confirmedEmail: Boolean,
}, {
    timestamps: true,
});

userSchema.methods.toJSON = function () { //override of the toJSON method to add token and remove password fields
    const { _id, name, lastname, username, email, token } = this; //here we take the user properties
    return { _id, name, lastname, username, email, token }; //here we return the user properties
};

userSchema.pre('save', function (next) {
    const user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(SALT).then(salt => bcrypt.hash(user.password, salt).then(hash => {
            user.password = hash;
            return next();
        }).catch(err => next(err))).catch(err => next(err))
    } else next();
});

userSchema.methods.generateAuthToken = function () {
    const user = this; // calls the this which contains the user properties
    const token = jwt.sign({
        _id: user._id
    }, SECRET_AUTH_JWT, {
        expiresIn: "7d"
    })
    return token;
}

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;