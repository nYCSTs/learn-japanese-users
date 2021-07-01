const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true
    },
    email: {
        type: String,
        require: true
    },
    pass: {
        type: String,
        require: true
    },
    testesSemanais: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Users', userSchema);