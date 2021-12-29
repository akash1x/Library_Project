const express = require("express");
const router = express.Router();
const Book = require("../models/book");
const Author = require("../models/author");
const path = require("path");
const fs = require("fs");

// to create actual book file we use npm lib multer
const multer = require("multer");

const uploadPath = path.join("public", Book.coverImageBasePath); // joins the imgae path with public

const imageMimeTypes = ["images/jpeg", "images/png", "images/gif"];
//we can we multer to call function on it which is used to configure multer to se it in the project
const upload = multer({
  dest: uploadPath,
});
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
router.post("/", upload.single("cover"), async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null;
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    description: req.body.description,
    coverImageName: fileName,
  });
  try {
    const newBook = await book.save();
    res.redirect("books");
  } catch (err) {
    if (book.coverImageName != null) removeBookCover(book.coverImageName);
    renderNewPage(res, book, true);
  }
});

async function renderNewPage(res, book, hasError = false) {
  try {
    const authors = await Author.find({});
    const params = {
      authors: authors,
      book: book,
    };
    if (hasError) params.errorMessage = "Error Creating new Book";
    res.render("books/new", params);
  } catch {
    res.redirect("/books");
  }
}

function removeBookCover(fileName) {
  fs.unlink(path.join(uploadPath, fileName), (err) => {
    if (err) console.error(err);
  }); // unlink we remove the file from the file system
}

module.exports = router;
