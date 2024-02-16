import "../Trivia.css";

const Trivia = () => {
  return (
    <div className="trivia">
      <div className="question">Which is the best American football team?</div>
      <div className="answers">
        <div className="answer">Kansas City Chiefs</div>
        <div className="answer">San Francisco 49ers</div>
        <div className="answer">Detroit Lions</div>
        <div className="answer">Green Bay Packers</div>
      </div>
    </div>
  );
};

export default Trivia;
