const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const shopSchema = new Schema({
  sid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },

  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    default:
      "Discover a world of quality products at our shop. Find unique items that suit your style and needs. Explore now!",
  },

  logo: {
    type: String,
    default: "",
  },

  category: {
    type: Array,
    required: false,
  },

  title: {
    type: String,
    default: "Shop With Us",
  }
});

const shop = mongoose.model("shop", shopSchema);

module.exports = shop;