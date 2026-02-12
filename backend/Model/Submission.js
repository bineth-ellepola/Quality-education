const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    assessmentId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Assessment",
        required: true
    },
    learnerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true
    },
    submissionUrl: {
        type: String,
        required: true
    },
    grade: {
        type: Number,
        min: 0,
        max: 100
    },
    feedback: String,
    submittedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);