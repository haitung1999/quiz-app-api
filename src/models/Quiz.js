const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuizSchema = new Schema({
  description: { type: String, required: true },
  img: String,
  point: Number,
  choices: [
    {
      text: { type: String, required: true },
      isCorrect: { type: Boolean, required: true, default: false },
    },
  ],
  quizType: {
    type: String,
    enum: ["choice", "multiChoices"],
    default: "choice",
  },
});

module.exports = mongoose.model("quiz", QuizSchema);
