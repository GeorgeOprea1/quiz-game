import "../styles/Trivia.css";
import { useState, useEffect } from "react";
import he from "he";

const Trivia = ({ fetchData }) => {
  const [questions, setQuestions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const handleAnswerClick = (selectedAnswer) => {
    const isCorrect =
      selectedAnswer === questions[currentQuestionIndex].answers[0];

    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].selectedAnswer = selectedAnswer;
    updatedQuestions[currentQuestionIndex].isCorrect = isCorrect;
    setQuestions(updatedQuestions);

    if (!isCorrect) {
      setTimeout(() => {
        setGameOver(true);
        alert("Game Over!");
      }, 4000);
    } else {
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          setGameOver(true);
          alert("Congratulations! You've completed the game!");
        }
      }, 4000);
    }
  };

  useEffect(() => {
    if (fetchData && fetchData.length > 0) {
      const updatedQuestions = fetchData.map((questionData) => {
        return {
          question: he.decode(questionData.question),
          answers: [
            he.decode(questionData.correct_answer),
            ...questionData.incorrect_answers.map((answer) =>
              he.decode(answer)
            ),
          ],
        };
      });

      setQuestions(updatedQuestions);
      setCorrectAnswer(
        fetchData.map((questionData) => he.decode(questionData.correct_answer))
      );
      setAnswers(
        fetchData.map((questionData) => [
          he.decode(questionData.correct_answer),
          ...questionData.incorrect_answers.map((answer) => he.decode(answer)),
        ])
      );
    }
  }, [fetchData]);

  return (
    <div className="trivia">
      {questions.length > 0 && (
        <div className="question">
          {questions[currentQuestionIndex].question}
        </div>
      )}
      <div className="answers">
        {questions.length > 0 &&
          questions[currentQuestionIndex].answers.map((answer, index) => (
            <div
              className={`answer ${
                questions[currentQuestionIndex].selectedAnswer === answer
                  ? questions[currentQuestionIndex].isCorrect
                    ? "correct"
                    : "wrong"
                  : ""
              }`}
              key={index}
              onClick={() => handleAnswerClick(answer, index)}
            >
              {answer}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Trivia;
