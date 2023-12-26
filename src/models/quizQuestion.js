const mongoose = require("mongoose");
const validator = require("validator");

const questionSchema = mongoose.Schema({
    totalQuestions: {
        type: Number,
        required: true
    },
    questions: [
        {
            description: {
                type: String,
                required: true
            },
            option1: {
                type: String,
                required: true
            },
            option2: {
                type: String,
                required: true
            },
            option3: {
                type: String,
                required: true
            },
            option4: {
                type: String,
                required: true
            },
            correctAns: {
                type: String,
                required: true
            }
        }
    ]
});

const QuizQ = mongoose.model("QuizQ",questionSchema);
module.exports = QuizQ;