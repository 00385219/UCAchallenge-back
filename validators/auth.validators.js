const {body} = require ("express-validator")

const validators = {};
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

validators.registerValidator = [
    body('username')
      .notEmpty().withMessage('Ingrese un usuario')
      .isLength({ min: 5 }).withMessage('El usuario debe tener al menos 5 caracteres'),
    
    body('password')
      .notEmpty().withMessage('Ingrese una contraseña')
      .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres').matches(passwordRegex).withMessage("formato de contraseña incorrecto"),
      
    body('email')
      .notEmpty().withMessage('Ingrese un correo electrónico')
      .isEmail().withMessage('Ingrese un correo electrónico válido'),
  
  ];

module.exports = validators;