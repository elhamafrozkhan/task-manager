const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        trim: true,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    priority: {                       
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    dueDate: {       
        type: Date
    },
    category: {          
        type: String,
        default: "personal"
    },
    tags: {             
        type: [String],
        default: []
    },
    sharedWith: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
});

const Task = mongoose.model('Task', taskSchema);


module.exports = Task;
