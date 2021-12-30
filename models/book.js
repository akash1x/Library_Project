const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  publishDate: {
    type: Date,
    required: true,
  },
  pageCount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  coverImage: {
    type: Buffer, // Buffer of data representing our entire image
    required: true,
  },
  //Specifying the types of image allowed
  coverImageType: {
    type: String,
    required: true,
  },
  //This is how referencing works in mongoDB
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Author",
  },
});

// Create a virtual property: It will acts as any other field available in the
//model but it will actually derive it's value from the existing one.
//.get() : whenever will will call book.coverImagePath it will executed the get() internally
bookSchema.virtual("coverImagePath").get(function () {
  if (this.coverImage != null && this.coverImageType != null) {
    return `data:${
      this.coverImageType
    }; charset=utf-8, base64, ${this.coverImage.toString("base64")}`; //data object that we can we for src for images. It allows us to take buffer data and use it for an actual source for the image
  }
});

//'Book' will be the name of the table inside our database
module.exports = mongoose.model("Book", bookSchema);
//Below is export by giving name, and above is how we export default
