const Quiz = require("../models/Quiz");
const UserChoice = require("../models/UserChoice");
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
      return handleError(res, error, "Cannot get quizzes");
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
      return handleError(res, error, "Cannot get quiz");
    }
  }

  // create quiz
  async create(req, res) {
    const { description, img, choices, quizType } = req.body;
    const newQuiz = { description, img, choices, quizType };

    try {
      const quiz = await Quiz.create(newQuiz);
      return res.status(201).json({ data: quiz, success: true });
    } catch (error) {
      return handleError(res, error, "Cannot create quiz");
    }
  }

  // update quiz
  async update(req, res) {
    const { description, img, choices, quizType } = req.body;
    const updateQuiz = { description, img, choices, quizType };
    const _id = req.params.quiz_id;

    try {
      const quiz = await Quiz.findById(_id).exec();

      if (quiz) {
        const result = await Quiz.findOneAndUpdate(
          { _id: _id },
          { $set: updateQuiz },
          { omitUndefined: true, new: true }
        );
        return res.status(200).json({ data: result, success: true });
      }

      return res
        .status(404)
        .json({ message: "Quiz not found!", success: false });
    } catch (error) {
      return handleError(res, error, "Cannot update quiz");
    }
  }

  // delete quiz
  async delete(req, res) {
    const _id = req.params.quiz_id;
    try {
      const quiz = await Quiz.findById(_id).exec();

      if (quiz) {
        const result = await Quiz.deleteOne({ _id: _id });
        return res.status(200).json({ data: result, success: true });
      }
      return res.status(400).json({
        message: "Quiz not found!",
        success: false,
      });
    } catch (error) {
      return handleError(res, error, "Cannot delete quiz");
    }
  }

  async submitQuiz(req, res) {
    const data = req.body.data;
    const dataResponse = {
      choices,
      isCorrect,
      user_id,
      quiz_id,
      user_response_id,
    };

    const score = 0;

    data.map(async (e) => {
      const quiz = await Quiz.findById(e.quiz_id).exec();
      console.log("quiz----", quiz);

      const userChoiceId = e.choices_id;
      userChoiceId.map((id) => {
        quiz.choices.map((quizChoices) => {
          if (id === quizChoices._id) {
            dataResponse.isCorrect = quizChoices.isCorrect;
            if (quizChoices.isCorrect === true) {
              score += quiz.point;
            }
          }
        });
      });
    });
  }
}

module.exports = new QuizController();
