import "./styles/App.css";
import { useState, useEffect, useSyncExternalStore } from "react";
import Trivia from "./components/Trivia";
import Settings from "./components/Settings";
import he from "he";
import GameOver from "./components/GameOver";

function App() {
  const [settings, setSettings] = useState(true);
  const [start, setStart] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState(null);
  const [questionCategory, setQuestionCategory] = useState("");
  const [questionDifficulty, setQuestionDifficulty] = useState("");
  const [fetchData, setFetchData] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [result, setResult] = useState("");

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
        setStart(false);
        setResult("lose");
      }, 4000);
    } else {
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          setGameOver(true);
          alert("Congratulations! You've completed the game!");
          setResult("win");
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

  const fetchQuestions = () => {
    const apiUrl = `https://opentdb.com/api.php?amount=15&category=${questionCategory}&difficulty=${questionDifficulty}&type=multiple`;
    setLoading(true);
    setStart(true);

    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        setFetchData(data.results);
        console.log("Fetched Questions:", fetchData);
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

  const handleLogoClick = () => {
    setSettings(true);
    setStart(false);
    setGameOver(false);
    setCurrentQuestionIndex(0);
  };

  const handleStartClick = () => {
    setSettings(false);
    setStart(true);
    fetchQuestions();
  };

  return (
    <div className="app-container">
      {settings && (
        <Settings
          loading={loading}
          options={options}
          questionCategory={questionCategory}
          questionDifficulty={questionDifficulty}
          handleCategoryChange={handleCategoryChange}
          handleDifficultyChange={handleDifficultyChange}
          handleStartClick={handleStartClick}
        />
      )}
      {start && (
        <>
          <div className="main">
            <div className="top">
              <img
                src="/millionaire.svg"
                alt="logo"
                className="logo"
                onClick={handleLogoClick}
              />
              <div className="timer">30</div>
            </div>
            <div className="bottom">
              <Trivia
                questions={questions}
                handleAnswerClick={handleAnswerClick}
                currentQuestionIndex={currentQuestionIndex}
              />
            </div>
          </div>
          <div className="money-scale">
            <ul className="moneyList">
              {moneyScale.map((m) => (
                <li
                  key={m.id}
                  className={
                    currentQuestionIndex === m.id - 1
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
      )}
      {gameOver && (
        <GameOver
          result={result}
          onRestartClick={() => {
            setSettings(true);
            setStart(false);
            setGameOver(false);
            setCurrentQuestionIndex(0);
          }}
        />
      )}
    </div>
  );
}

export default App;
