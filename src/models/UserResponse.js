const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserResponseSchema = new Schema(
  {
    total_score: Number,
    total_quiz: Number,
    user_id: { type: Schema.Types.ObjectId, ref: "user" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("userResponse", UserResponseSchema);
