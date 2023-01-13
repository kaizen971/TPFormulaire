import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import session from 'express-session'

import mongoose from "mongoose";
import route from "./routes/routes.js";
import flash from "connect-flash";


// ==========
// App initialization
// ==========

dotenv.config();
const { APP_HOSTNAME, APP_PORT, NODE_ENV,APP_SECRET } = process.env;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

mongoose
  .connect("mongodb://127.0.0.1:27017/TP", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    // Démarrage de l'app Node une fois que la connexion Mongoose est bien établie
    app.listen(APP_PORT, APP_HOSTNAME, () =>
      console.log("API listening on http://localhost:8000/")
    )
);

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(session({secret: APP_SECRET, resave: false, saveUninitialized: true}));


app.set("view engine", "pug");
app.locals.pretty = (NODE_ENV !== 'production'); // Indente correctement le HTML envoyé au client (utile en dev, mais inutile en production)
// ==========
// App middlewares
// ==========

app.use(express.static(path.join(__dirname, "public")));
app.use(flash());

app.use((req, res, next) => {
    res.locals.flash_message = req.flash("success_message");
    res.locals.messages = [];
    next();
});
// ==========
// App routers
// ==========

app.use("/", route);

// ==========
// App start
// ==========

