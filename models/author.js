const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

//'Author' will be the name of the table inside our database
module.exports = mongoose.model("Author", authorSchema);
