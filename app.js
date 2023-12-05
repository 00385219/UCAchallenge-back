const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const database = require("./config/database.config");

const cors = require('cors'); // Importa cors


const  apiRouter = require("./routes/index.router")
const app = express();
database.connect();

app.use(cors()); // Utiliza cors como middleware (esto permite todas las solicitudes CORS)


app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use("/api",apiRouter);


module.exports = app;


