const express = require("express");
const router = express.Router();
const ROLES= require("../data/roles.constants.json");


const {createQuestionValidator, idInParamsValidator} = require ("../validators/question.validator")
const validateFields = require ("../validators/index.middleware");

const {authentication, authorization} = require("../middlewares/auth.middlewares")

const questionController = require("../controllers/Question.controller");


router.get("/", questionController.findAll);
router.get("/:identifier",idInParamsValidator,validateFields,questionController.findOneById);
router.post(["/", "/:identifier"],authentication,authorization(ROLES.USER), createQuestionValidator,validateFields,questionController.save);
router.delete("/:identifier",idInParamsValidator,validateFields,questionController.deleteById);


module.exports = router;
