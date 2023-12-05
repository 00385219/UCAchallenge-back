const express = require ("express");
const router = express.Router();

const questionController = require('../controllers/Question.controller');

const postRouter = require("./post.router")
const authRouter = require("./auth.router")

router.get('/preguntas/:categoria/:tipo', questionController.getPreguntasPorCategoriaYTipo);


router.use("/auth",authRouter);
router.use("/post",postRouter);

module.exports = router;

