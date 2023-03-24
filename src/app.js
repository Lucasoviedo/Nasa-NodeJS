const cors = require("cors");
const express = require("express");
const config = require("./config");
const bodyParser = require("body-parser");

const calendarRoutes = require("./routes/calendar.routes");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(express.urlencoded({ extended: false }));
app.set("port", config.seting.port);
app.use(cors());

app.use(calendarRoutes.Router);

exports.app = app;
