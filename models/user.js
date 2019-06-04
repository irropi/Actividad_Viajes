const mongoose = require('mongoose');
const {
    isEmail
} = require('validator');
// const bcrypt = require('bcrypt');
const SALT = 10;
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        maxlength: 40,
        required: true,
    },
    lastname: String,
    email: {
        type: String,
        unique: true,
        required: true,
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
        required: true,
    },
    password: {
        type: String,
        minlength: 8,
        required: true,
    }
});

// userSchema.pre('save', function (next) {
//     const user = this;
//     if (user.isModified('password')) {
//         bcrypt.genSalt(SALT).then(salt => bcrypt.hash(user.password, salt).then(hash => {
//             user.password = hash;
//             return next();
//         }).catch(err => next(err))).catch(err => next(err))
//     } else next();
// });

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;