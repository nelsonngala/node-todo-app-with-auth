const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
    todo: {
      type: String,
      required: true,  
    },
    createdAt: {
        type: Date,
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Todo', TodoSchema);