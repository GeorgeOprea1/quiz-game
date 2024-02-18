import "../styles/Trivia.css";

const Trivia = ({ questions, currentQuestionIndex, handleAnswerClick }) => {
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
