import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import mongoStore from "connect-mongo";
import productsRouter from './routers/products.router.js';
import viewsRouter from "./routers/views.router.js";
import sessionsRouter from "./routers/sessions.router.js";

const app = express();

const PORT = 8080;
const MONGO_URL = "mongodb+srv://stevanvasquez270101:MPtRpvdSuoI8ofN1@cluster55575ap.e8hnl3g.mongodb.net/DesafioEntregableImpleLogin?retryWrites=true&w=majority";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use(session({
        store: mongoStore.create({
        mongoUrl: MONGO_URL,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 360,
    }),
        secret: "secretSession",
        resave: false,
        saveUninitialized: false,
    })
);

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

const connection = mongoose.connect(MONGO_URL).then((connect) => { console.log("CONECTADO!!!!") }).catch((err) => { console.log(err) });

app.use("/", viewsRouter);
app.use("/api/session", sessionsRouter);
app.use('/api/products', productsRouter);

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});