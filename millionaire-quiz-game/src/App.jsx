import "./styles/App.css";
import { useState, useEffect } from "react";
import Trivia from "./components/Trivia";
import Settings from "./components/Settings";

function App() {
  const [questionNumber, setQuestionNumber] = useState(1);
  const [start, setStart] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState(null);
  const [questionCategory, setQuestionCategory] = useState("");
  const [questionDifficulty, setQuestionDifficulty] = useState("");
  const [questionType, setQuestionType] = useState("");

  useEffect(() => {
    const apiUrl = `https://opentdb.com/api_category.php`;
    setLoading(true);
    fetch(apiUrl)
      .then((res) => res.json())
      .then((response) => {
        setLoading(false);
        setOptions(response.trivia_categories);
      });
  }, [setOptions]);
  const handleCategoryChange = (event) => {
    setQuestionCategory(event.target.value);
  };
  const handleDifficultyChange = (event) => {
    setQuestionDifficulty(event.target.value);
  };
  const handleTypeChange = (event) => {
    setQuestionType(event.target.value);
  };

  const fetchQuestions = () => {
    const apiUrl = `https://opentdb.com/api.php?amount=15&category=${questionCategory}&difficulty=${questionDifficulty}&type=${questionType}`;
    setLoading(true);
    setStart(true);

    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        const questions = data;
        console.log("Fetched Questions:", questions);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching questions:", error);
      });
  };

  const moneyScale = [
    { id: 1, amount: "$ 100" },
    { id: 2, amount: "$ 200" },
    { id: 3, amount: "$ 300" },
    { id: 4, amount: "$ 500" },
    { id: 5, amount: "$ 1000" },
    { id: 6, amount: "$ 2000" },
    { id: 7, amount: "$ 4000" },
    { id: 8, amount: "$ 8000" },
    { id: 9, amount: "$ 16000" },
    { id: 10, amount: "$ 32000" },
    { id: 11, amount: "$ 64000" },
    { id: 12, amount: "$ 125000" },
    { id: 13, amount: "$ 250000" },
    { id: 14, amount: "$ 500000" },
    { id: 15, amount: "$ 1000000" },
  ].reverse();

  return (
    <div className="app-container">
      {start ? (
        <>
          <div className="main">
            <div className="top">
              <img
                src="/millionaire.svg"
                alt="logo"
                className="logo"
                onClick={() => {
                  setStart(false);
                }}
              />
              <div className="timer">30</div>
            </div>
            <div className="bottom">
              <Trivia />
            </div>
          </div>
          <div className="money-scale">
            <ul className="moneyList">
              {moneyScale.map((m) => (
                <li
                  key={m.id}
                  className={
                    questionNumber === m.id
                      ? "moneyList-item active"
                      : " moneyList-item"
                  }
                >
                  <span className="number">{m.id}</span>
                  <span className="amount">{m.amount}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <Settings
          loading={loading}
          options={options}
          questionCategory={questionCategory}
          questionType={questionType}
          questionDifficulty={questionDifficulty}
          handleCategoryChange={handleCategoryChange}
          handleDifficultyChange={handleDifficultyChange}
          handleTypeChange={handleTypeChange}
          fetchQuestions={fetchQuestions}
        />
      )}
    </div>
  );
}

export default App;
