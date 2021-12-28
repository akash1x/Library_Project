if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

//Routes path
const indexRouter = require("./routes/index");
const authorRouter = require("./routes/authors");

//Setting view engine
app.set("view engine", "ejs");

//Setting from where our views will come. __dirname :give current directory
app.set("views", __dirname + "/views");

//hooking up express layouts
app.set("layout", "layouts/layout");
app.use(expressLayouts);

//Setting static files
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));

//Setting up the database

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

//Seting up the route
app.use("/", indexRouter);
app.use("/authors", authorRouter);

app.listen(process.env.PORT || 3000, (err) => {
  console.log("Server started");
});
