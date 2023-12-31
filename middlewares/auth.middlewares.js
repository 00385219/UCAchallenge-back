const debug = require("debug")("app:auth-middleware");
const { verifyToken } = require("./../utils/jwt.tools")
const User = require("./../models/User.model")

const ROLES = require("../data/roles.constants.json")


const middlewares = {};
const PREFIX = "Bearer";

middlewares.authentication = async (req, res, next) => {
  try {

    debug("Usuario identificado");
    const { authorization } = req.headers;

    if (!authorization) {

      return res.status(401).json({ error: "Usuario no autenticado" });

    }

    const [prefix, token] = authorization.split(" ");

    if (prefix !== PREFIX) {

      return res.status(401).json({ error: "Usuario no autenticado" });

    }

    if (!token) {
      return res.status(401).json({ error: "Usuario no autenticado" });

    }

    const payload = await verifyToken(token);
    if (!payload) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const userId = payload["sub"];
    const user = await User.findById(userId);

    if (!user) {

      return res.status(401).json({ error: "Usuario no autenticado" });

    }
    const isTokenValid = user.tokens.includes(token);

    if (!isTokenValid) {

      return res.status(401).json({ error: "Usuario no autenticado" });

    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "error interno del servidor :(" })
  }

}

middlewares.authorization = (roleRequired = ROLES.SYSADMIN) => {
  return (req, res, next) => {

    try {
      const { roles = [] } = req.user;
      
      const isAuth = roles.includes(roleRequired)
      const isSysadmin= roles.includes(ROLES.SYSADMIN)

      if(!isAuth && !isSysadmin){
        return res.status(403).json({error:"Forbidden"});
      }
   
   
   
      next();
    } catch (error) {
      return res.status(500).json({ error: "error interno del servidor :(" })

    }
  }
}

module.exports = middlewares; 