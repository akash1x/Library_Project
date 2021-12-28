const express = require("express");
const router = express.Router();
const Author = require("../models/author");
//All Authors
//Route authors/ since it is already prepended in server.js there fore only / will work
router.get("/", async (req, res) => {
  var searchOptions = {};
  if (req.query.name != null && req.query.name != "") {
    searchOptions.name = new RegExp(req.query.name, "i");
  }
  try {
    const authors = await Author.find(searchOptions);
    res.render("authors/index", { authors: authors, searchOptions: req.query });
  } catch {
    res.render("/");
  }
});

//New Author
router.get("/new", (req, res) => {
  res.render("authors/new", { author: new Author() });
});

//Create author
router.post("/", async (req, res) => {
  // Note: body.name because in input we have set the name="name" name attribute to name if name="n" then we would have used body.n
  //res.send(req.body.name)

  const author = new Author({
    name: req.body.name,
  });

  try {
    const newAuthor = await author.save();
  } catch (err) {
    res.render("authors/new", {
      author: author,
      errorMessage: "Something went wrong",
    });
  }
});

module.exports = router;
