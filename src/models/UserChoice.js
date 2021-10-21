const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserChoiceSchema = new Schema(
  {
    choices: [{ type: Schema.Types.ObjectId }],
    isCorrect: Boolean,
    user_id: { type: Schema.Types.ObjectId, ref: "user", required: true },
    quiz_id: { type: Schema.Types.ObjectId, ref: "quiz", required: true },
    user_response_id: {
      type: Schema.Types.ObjectId,
      ref: "userResponse",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("userChoice", UserChoiceSchema);
