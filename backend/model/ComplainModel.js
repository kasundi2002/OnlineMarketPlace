const mongoose = require("mongoose");

const ComplainSchema = new mongoose.Schema({
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "shop",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "Not checked",
    },


}, { timestamps: true });

const ComplainModel = mongoose.model("Complain", ComplainSchema);

module.exports = ComplainModel;