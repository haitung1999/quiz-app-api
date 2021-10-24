const Quiz = require("../models/Quiz");
const UserChoice = require("../models/UserChoice");
const UserResponse = require("../models/UserResponse");
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

  // Handle submission from user
  async submitQuiz(req, res) {
    const data = req.body.data;

    let score = 0;
    const dataResponse = [];

    data.map(async (data) => {
      const quiz = await Quiz.findById(data.quiz_id).exec();

      const userChoiceId = data.choices_id;
      const answer = {
        choices: userChoiceId,
        isCorrect: false,
        user_id: req.user,
        quiz_id: data.quiz_id,
      };

      if (userChoiceId.length > 1) {
        let checkCorrect = true;
        userChoiceId.map((userChoiceId) => {
          quiz.choices.map((quizChoices) => {
            if (
              userChoiceId === quizChoices.id &&
              quizChoices.isCorrect === false
            ) {
              checkCorrect = false;
            }
          });
        });
        if (checkCorrect) {
          answer.isCorrect = true;
          score += quiz.point;
        }
      } else {
        quiz.choices.map((quizChoices) => {
          if (userChoiceId[0] === quizChoices.id) {
            answer.isCorrect = quizChoices.isCorrect;
            if (quizChoices.isCorrect === false) {
              return false;
            } else return (score += quiz.point);
          }
        });
      }
      dataResponse.push(answer);
    });

    const insertDataRes = {
      total_score: score,
      total_quiz: data.length,
      user_id: req.user.id,
    };
    const result = {
      // listQuiz:
      listAnswer: dataResponse,
      total_score: insertDataRes.total_score,
      total_quiz: insertDataRes.total_quiz,
    };

    const userResponse = await UserResponse.create(insertDataRes);

    dataResponse.map(async (answer) => {
      answer.user_response_id = userResponse.id;
      await UserChoice.create(answer);
    });

    return res.status(201).json({ data: result, success: true });
  }
}

module.exports = new QuizController();
