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
                const result = await Quiz.findOneAndUpdate({ _id: _id }, { $set: updateQuiz }, { omitUndefined: true, new: true });
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

    //Xử lý kết quả user gửi lên
    async submitQuiz(req, res) {
        const data = req.body.data;
        const dataResponse = []; // Danh sách các item insert bảng userChoice

        const score = 0; // Điểm nhận được.

        data.map(async(e) => { //check từng đáp án của user gửi lên
            const quiz = await Quiz.findById(e.quiz_id).exec(); //call thông tin câu hỏi
            console.log("quiz----", quiz);

            const userChoiceId = e.choices_id; // đáp án user chọn []
            var answer = {
                choices,
                isCorrect,
                user_id,
                quiz_id,
                user_response_id,
            }; // item sẽ insert vào bảng userChoice
            answer.user_id = a; //gán câu trả của user nào;
            answer.quiz_id = e.quiz_id; // id của câu hỏi
            answer.choices = userChoiceId; // Mảng câu trả lời của user
            answer.isCorrect = false; // mặc định kết quả là sai
            if (userChoiceId.length > 1) { //check trường hợp câu hỏi có nhiều đáp án
                var checkCorrect = true; // mặc định là đáp án là đúng
                userChoiceId.map((id) => {
                    quiz.choices.map((quizChoices) => {
                        if (id === quizChoices._id) { //Check đáp án của user có bằng id của đáp án câu hỏi
                            if (quizChoices.isCorrect === false) {
                                checkCorrect = false; //Khi có đáp án sai sẽ => false
                            }
                        }
                    });
                });
                if (checkCorrect) { //Nếu đáp án đúng
                    score += quiz.point;
                    answer.isCorrect = true;
                }
            } else {
                quiz.choices.map((quizChoices) => {
                    if (userChoiceId[0] === quizChoices._id) {
                        answer.isCorrect = quizChoices.isCorrect; // gán kết quả câu trả là đúng hay sai
                        if (quizChoices.isCorrect === true) {
                            score += quiz.point;
                        }
                    }
                });
            }

            dataResponse.push(answer); //đẩy câu trả vào mảng câu trả lời tổng
        });

        //insert vào bảng user response
        const insertDataResponse = {
            'total_score': score,
            'total_quiz': data.length,
            'user_id': user.id
        }
        const userReponse = await UserResponse.create(insertDataResponse);
        dataResponse.map(async(answer) => {
            answer.user_response_id = userReponse._id;
            const createUserChoice = await UserChoice.create(answer); // insert từng câu hỏi của user vào bảng userChoicd
        })
        var res = {
            "listQuiz": listQuiz, //danh sách câu hỏi,
            "listAnswer": dataResponse, //Các trả lời của user từ Bảng userChoice
            "total_score": insertDataResponse.total_score,
            "total_quiz": insertDataResponse.total_quiz
        }
        return res.status(201).json({ data: res, success: true });
    }
}

module.exports = new QuizController();