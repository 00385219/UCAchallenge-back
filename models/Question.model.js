const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OptionSchema = new Schema({
    optionText: {
        type: String,
        required: true,
    },
    isCorrect: {
        type: Boolean,
        required: true,
    },
});

const QuestionSchema = new Schema({
    type: {
        type: String,
        enum: ['multiple-choice', 'true-false', 'imagenes'],
        required: true,
    },
    questionText: {
        type: String,
        required: true,
    },
    options: [OptionSchema],
});

const QuizSchema = new Schema({
    topic: {
        type: String,
        required: true,
    },
    section: {
        type: String,
        required: true,
    },
    questions: [QuestionSchema],
}, { timestamps: true });

const Quiz = mongoose.model('Quiz', QuizSchema);

module.exports = Quiz;
