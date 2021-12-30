const express = require("express");
const router = express.Router();
const Book = require("../models/book");
const Author = require("../models/author");
const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"];

//All Books
//Route authors/ since it is already prepended in server.js there fore only / will work
router.get("/", async (req, res) => {
  let query = Book.find();
  if (req.query.title != null && req.query.title != "") {
    query = query.regex("title", new RegExp(req.query.title, "i"));
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore != "") {
    query = query.lte("publishedDate", req.query.publishedBefore);
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != "") {
    query = query.gte("publishedDate", req.query.publishedAfter);
  }
  try {
    const books = await query.exec();
    res.render("books/index", {
      books: books,
      searchOptions: req.query,
    });
  } catch {
    res.redirect("/");
  }
});

//New Books
router.get("/new", async (req, res) => {
  renderNewPage(res, new Book(), false);
});

//Create Books
//upload.single('cover') : cover will be name which we have used in name attr of form
router.post("/", async (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    description: req.body.description,
  });
  saveCover(book, req.body.cover);
  try {
    const newBook = await book.save();
    res.redirect(`books/${newBook.id}`);
  } catch (err) {
    console.log(err);
    renderNewPage(res, book, true);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("author").exec(); // populate will populate all author info inside book object
    res.render("books/show", { book: book });
  } catch (e) {
    console.log(e);
    res.redirect("/");
  }
});

//Edit
router.get("/:id/edit", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    renderEditPage(res, book);
  } catch {}
});

//PUT Update
router.put("/:id", async (req, res) => {
  let book;
  try {
    book = await Book.findById(req.params.id);
    book.title = req.body.title;
    book.author = req.body.author;
    book.publishDate = new Date(req.body.publishDate);
    book.pageCount = req.body.pageCount;
    book.description = req.body.description;
    if (req.body.cover != null && req.body.cover !== "")
      saveCover(book, req.body.cover);
    await book.save();
    res.redirect(`/books/${book.id}`);
  } catch (err) {
    console.log(err);
    if (book != null) renderEditPage(res, book, true);
    else res.redirect("/");
  }
});

router.delete("/:id", async (req, res) => {
  let book;
  try {
    book = await Book.findById(req.params.id);
    await book.remove();
    res.redirect("/books");
  } catch {
    if (book != null) {
      res.render("books/show", {
        book: book,
        errorMessage: "Could not remove book",
      });
    } else {
      res.redirect("/");
    }
  }
});

async function renderNewPage(res, book, hasError = false) {
  renderFormPage(res, book, "new", hasError);
}

async function renderEditPage(res, book, hasError = false) {
  renderFormPage(res, book, "edit", hasError);
}

async function renderFormPage(res, book, form, hasError = false) {
  try {
    const authors = await Author.find({});
    const params = {
      authors: authors,
      book: book,
    };
    if (hasError) {
      if (form == "edit") params.errorMessage = "Error Updating book";
      else params.errorMessage = "Error Creating new Book";
    }
    res.render(`books/${form}`, params);
  } catch {
    res.redirect("/books");
  }
}

function saveCover(book, coverEncoded) {
  if (coverEncoded == null) return;
  const cover = JSON.parse(coverEncoded); // Gives decode version of cover
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    book.coverImage = new Buffer.from(cover.data, "base64"); // Making it a buffer from some set of data. since it is base64 encoded therefore mention it
    book.coverImageType = cover.type; // So that when we retrive info from data base we can encode it to correct type
  }
}

module.exports = router;
