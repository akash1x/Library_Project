const mongoose = require("mongoose");
const Book = require("./book");
const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

// This is used to run piece of code before an action which in this case is remove
authorSchema.pre("remove", function (next) {
  Book.find({ author: this.id }, (err, books) => {
    if (err) {
      next(err);
    } else if (books.length > 0) {
      next(new Error("This author has some books associated with it"));
    } else {
      next();
    }
  });
});

//'Author' will be the name of the table inside our database
module.exports = mongoose.model("Author", authorSchema);
