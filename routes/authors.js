const express = require("express");
const router = express.Router();
const Author = require("../models/author");
const Book = require("../models/book");

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
    res.redirect(`authors/${newAuthor.id}`);
  } catch (err) {
    res.render("authors/new", {
      author: author,
      errorMessage: "Something went wrong",
    });
  }
});

//Get Author through i. This should be after our new Author route as it goes from top to bottom .
router.get("/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    const books = await Book.find({ author: author.id }).limit(6).exec();
    res.render("authors/show", {
      author: author,
      booksByAuthor: books,
    });
  } catch {
    res.redirect("/");
  }
});

//Edit an author
router.get("/:id/edit", async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id);

    res.render("authors/edit", { author: author });
  } catch {
    res.redirect("/authors");
  }
});

//Update
router.put("/:id", async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id);
    author.name = req.body.name;
    await author.save();
    res.redirect(`/authors/${author.id}`);
  } catch (err) {
    if (author == null) res.redirect("/");
    else {
      res.render("authors/edit", {
        author: author,
        errorMessage: "Error Updating the author",
      });
    }
  }
});

//Delete
router.delete("/:id", async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id);
    await author.remove();
    res.redirect("/authors");
  } catch (err) {
    if (author == null) res.redirect("/");
    else {
      res.redirect(`/authors/${author.id}`);
    }
  }
});

module.exports = router;
