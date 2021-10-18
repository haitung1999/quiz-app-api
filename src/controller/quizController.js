const Quiz = require("../models/Quiz");
const { handleError } = require("../utils/handleError");

class QuizController {
  // get all quizzes
  async getAll(req, res) {
    try {
      const quizzes = await Quiz.find().sort({ createdAt: "desc" });
      if (quizzes) {
        return res.status(200).json({ data: quizzes, success: true });
      }
    } catch (error) {
      return handleError(res, e, "Cannot get quizzes");
    }
  }

  // get one quiz
  async getOne(req, res) {
    try {
      const _id = req.params.quiz_id;
      const quiz = await Quiz.findById(_id);

      if (quiz) {
        return res.status(200).json({ data: quiz, success: true });
      }
    } catch (error) {
      return handleError(res, e, "Cannot get quiz");
    }
  }

  // create quiz

  async create(req, res) {
    const { description, img, choices } = req.body;
    const newQuiz = { description, img, choices };

    try {
      const quiz = await Quiz.create(newQuiz);
      return res.status(200).json({ data: quiz, success: true });
    } catch (error) {
      return handleError(res, e, "Cannot create quiz");
    }
  }
}

module.exports = new QuizController();
