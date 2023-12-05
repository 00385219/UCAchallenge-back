const User = require("../models/User.model");
const ROLES = require("../data/roles.constants.json")

const { createToken, verifyToken } = require("./../utils/jwt.tools");

const controller = {};

controller.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const user =
      await User.findOne({ $or: [{ username: username }, { email: email }] });

    if (user) {
      return res.status(409).json({
        error: "el usuario ya existe",
      });
    }

    // creating the user
    const newUser = new User({
      username,
      email,
      password: password,
      roles: [ROLES.USER]
    });

    // saving the user in the database
    await newUser.save();

    res.status(201).json({ message: "Usuario creado" });

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "error interno del servidor :(" });
  }
}

controller.guardarResultadoQuiz = async (req, res) => {
  try {
      const { email, quizResult } = req.body; // Recibe email y resultados del quiz

      const user = await User.findOne({ email: email }); // Busca al usuario por correo electrónico

      if (!user) {
          return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // Aquí asumo que tienes un campo en el modelo de usuario para almacenar resultados del quiz
      user.quizResponses.push(quizResult); // Agregar el resultado del quiz

      await user.save(); // Guardar el usuario actualizado

      return res.status(200).json({ message: 'Resultado del quiz guardado exitosamente' });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error interno del servidor' });
  }
}


controller.login = async (req, res, next) => {
  try {
    

    const { identifier, password } = req.body;

    // Buscar al usuario por nombre de usuario o correo electrónico
    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (!user || !user.comparePassword(password)) {
      return res.status(401).json({ error: 'Usuario incorrecto o contraseña incorrecta' });
    }

    const token = await createToken(user._id);

    // Agregar el nuevo token al inicio del array
    user.tokens.unshift(token);

    // Limitar la cantidad de tokens almacenados a 4
    user.tokens = user.tokens.slice(0, 4);

    // Guardar el usuario actualizado en la base de datos
    await user.save();

    return res.status(200).json({
      token,
      usuario: user.username // O cualquier campo que represente el nombre del usuario
    });

    


  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor :(' });
  }
};

/*controller.login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    // Buscar al usuario por nombre de usuario
    const user =
      await User.findOne({ $or: [{ username: identifier }, { email: identifier }] });

    if (!user || !user.comparePassword(password)) {
      // Si el usuario no existe o la contraseña no coincide, devolver un error
      return res.status(401).json({ error: 'usuario incorrecto o contraseña incorrecta' });
    }
    const token = await createToken(user._id);

    let _tokens = [... user.tokens];
    const _verifyPromises = _tokens.map(async (_t) => {
      const status = await verifyToken(_t);

      return status ? _t : null;
    });

   _tokens = (await Promise.all(_verifyPromises))
   .filter(_t => _t).slice(0, 4);

    _tokens = [token, ... _tokens];
    user.tokens = _tokens;
    await user.save();

    return res.status(200).json({token});

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor :(' });
  }
};*/

module.exports = controller;