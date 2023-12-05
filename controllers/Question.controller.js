const Quiz = require("../models/Question.model");
const debug = require("debug")("app:Question-controller")
const controller = {};

controller.save = async (req, res, next) => {
    try {
        const { topic, section, questions } = req.body; // Cambiado de 'question' a 'questions'
        const { identifier } = req.params;
        const { user } = req;
        
        let quiz;

        if (identifier) {
            // Si hay un identificador, significa que estamos actualizando un cuestionario existente
            quiz = await Quiz.findById(identifier);

            if (!quiz) {
                return res.status(404).json({ error: "Quiz no encontrado" });
            }

            // Limpiamos las preguntas existentes antes de actualizarlas
            quiz.questions = [];
        } else {
            // Si no hay identificador, creamos un nuevo cuestionario
            quiz = new Quiz();
        }

        // Actualizamos el cuestionario con los nuevos datos
        quiz.topic = topic;
        quiz.section = section;
        quiz.questions = questions;

        // Guardamos el cuestionario
        const quizSaved = await quiz.save();

        // Respondemos con el nuevo cuestionario creado o actualizado
        return res.status(201).json(quizSaved);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error interno del servidor :(" });
    }
};

controller.getPreguntasPorCategoriaYTipo = async (req, res) => {
    try {
        const { categoria, tipo } = req.params;
        const preguntas = await Quiz.find({
            'section': categoria,
            'questions.type': tipo
        });
        res.status(200).json(preguntas);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor :(' });
    }
};

controller.findAll = async (req, res, next) => {
    try {
        const quizzes = await Quiz.find();
        return res.status(200).json({ quizzes });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error interno del servidor :(" });
    }
};
// findOneById con diagnóstico
controller.findOneById = async (req, res, next) => {
    try {
        const { identifier } = req.params;

        const question = await Quiz.findById(identifier);
        if (!question) {
            return res.status(404).json({ error: "Pregunta no encontrada en el quiz" });
        }

        return res.status(200).json({ question });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error interno del servidor :(" });
    }
};

// deleteById con diagnóstico
controller.deleteById = async (req, res, next) => {
    try {
        const { identifier } = req.params;

        const quiz = await Quiz.findByIdAndDelete(identifier);


        if (!quiz) {
            return res.status(404).json({ error: "No se encontró la pregunta" });
        }

        return res.status(200).json({ message: "Se borró correctamente la pregunta" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error interno del servidor :(" });
    }
};

module.exports = controller;
