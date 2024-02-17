import "../styles/Trivia.css";
import { useState, useEffect } from "react";
import he from "he";

const Trivia = ({ fetchData }) => {
  const [questions, setQuestions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState([]);
  const [answers, setAnswers] = useState([]);

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
      {/* Display the first question for now */}
      {questions.length > 0 && (
        <div className="question">{questions[0].question}</div>
      )}
      <div className="answers">
        {/* Display the first set of answers for now */}
        {answers.length > 0 &&
          answers[0].map((answer, index) => (
            <div className="answer" key={index}>
              {answer}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Trivia;
