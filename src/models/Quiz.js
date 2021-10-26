const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuizSchema = new Schema(
  {
    description: { type: String, required: true },
    img: String,
    point: { type: Number, default: 10 },
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("quiz", QuizSchema);
