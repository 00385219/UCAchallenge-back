const Mongoose = require("mongoose");
const debug = require('debug')("app:database");

// Utiliza la conexión con usuario y contraseña de MongoDB Atlas
const dburi = process.env.DBURI || `mongodb+srv://UCA-Challenge:UCACHALLENGE2023@cluster2.zagyes7.mongodb.net/Quiz?retryWrites=true&w=majority`;


/*const dbhost = process.env.DBHOST || "localhost";
const dbport= process.env.DBPORT || "27017";
const dbname= process.env.DBNAME || "UCA-Challenge";

const dburi = process.env.DBURI || 
`mongodb://${dbhost}:${dbport}/${dbname}`;
*/
const connect = async () => {
    try {
        Mongoose.connect(dburi);
        debug("Se ha iniciado la conexion a la base de datos")
    } catch (error) {
        console.error(error)
        debug("No se ha podido conectar a la base de datos")
        process.exit(1);
    }

}

const disconnect = async() => {
    try {
        await Mongoose.disconnect();
        debug("Conexion a la base de datos terminada")
    } catch (error) {
        process.exit(1);
    }

}

module.exports ={
    connect,
    disconnect

}