const mongoose = require('mongoose');

const options = {
    discriminatorKey: 'userType', 
    collection: 'users',
    timestamps: true
};

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },

    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    }
}, options);

module.exports = mongoose.model('User', userSchema);
