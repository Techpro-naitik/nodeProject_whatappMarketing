require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const ngrok = require("ngrok");

const app = express();
const db = require("./app/models");
global.__basedir = __dirname;

var corsOptions = { 
  origin: "http://localhost:4200",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json({ limit: "50mb" }));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb", parameterLimit: 50000 }));

// db.sequelize.sync();
 
require("./app/routes/routes")(app);

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Whatsapp API" });
});

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

ngrok.connect(
  {
    proto: "http",
    addr: process.env.PORT,
  },
  (err, url) => {
    if (err) {
      console.error("Error while connecting Ngrok", err);
      return new Error("Ngrok Failed");
    }
  }
);
 