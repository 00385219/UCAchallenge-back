const { body,param } = require ('express-validator');
const validators = {};
validators.createQuestionValidator = [
  param("identifier")
  .optional()
  .isMongoId().withMessage("El ID no cumple con los requisitos de Mongo"),
body("section")
  .notEmpty().withMessage("Ingresa la sección de la pregunta"),
body("questions.*.type")
  .notEmpty().withMessage("Ingresa el tipo de pregunta"),
body("questions.*.questionText")
  .notEmpty().withMessage("Ingresa el texto de la pregunta"),
body("questions.*.options")
  .if(body("questions.*.type").equals("multiple-choice"))
  .isArray({ min: 2 }).withMessage("Debe haber al menos dos opciones para preguntas de opción múltiple"),
body("questions.*.options.*.optionText")
  .if(body("questions.*.type").equals("multiple-choice"))
  .notEmpty().withMessage("Ingresa el texto de la opción"),
body("questions.*.options.*.isCorrect")
  .if(body("questions.*.type").equals("multiple-choice"))
  .isBoolean().withMessage("El campo 'isCorrect' debe ser un valor booleano"),
body("question.options.*.correctAnswer")
  .if(body("question.type").equals("multiple-choice"))
  .isBoolean().withMessage("El campo 'correctAnswer' debe ser un valor booleano")

];



validators.idInParamsValidator = [
    param("identifier")
    .notEmpty().withMessage("Es necesario un ID").isMongoId().withMessage("El ID no cumple con los requisitos de Mongo")
  ];

module.exports = validators;