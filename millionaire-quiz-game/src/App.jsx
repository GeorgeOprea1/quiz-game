import "./styles/App.css";
import { useState, useEffect, useRef } from "react";
import Trivia from "./components/Trivia";
import Settings from "./components/Settings";
import he from "he";
import GameOver from "./components/GameOver";
import useSound from "use-sound";
import play from "./sounds/play.mp3";
import correct from "./sounds/correct.mp3";
import wrong from "./sounds/wrong.mp3";
import wait from "./sounds/wait.mp3";
import click from "./sounds/click.mp3";

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
  const [timer, setTimer] = useState(30);

  const [playSound, { stop: stopPlaySound }] = useSound(play);
  const [correctSound] = useSound(correct);
  const [wrongSound] = useSound(wrong);
  const [waitSound, { stop: stopWaitSound }] = useSound(wait, { volume: 0.5 });
  const [clickSound] = useSound(click);

  const intervalIdRef = useRef(null);

  useEffect(() => {
    if (start && timer > 0) {
      intervalIdRef.current = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    if (timer === 0) {
      setGameOver(true);
      setStart(false);
      setResult("time");
      stopWaitSound();
      wrongSound();
    }

    return () => {
      clearInterval(intervalIdRef.current);
    };
  }, [start, timer, stopWaitSound, wrongSound]);

  const stopTimer = () => {
    clearInterval(intervalIdRef.current);
  };

  const handleAnswerClick = (selectedAnswer) => {
    stopTimer();
    clickSound();

    const isCorrect =
      selectedAnswer === questions[currentQuestionIndex].correctAnswer;

    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].selectedAnswer = selectedAnswer;
    updatedQuestions[currentQuestionIndex].isCorrect = isCorrect;
    setQuestions(updatedQuestions);

    if (!isCorrect) {
      setTimeout(() => {
        stopWaitSound();
        wrongSound();
      }, 2000);
      setTimeout(() => {
        setGameOver(true);
        setStart(false);
        setResult("lose");
      }, 5000);
    } else {
      setTimeout(() => {
        correctSound();
        stopWaitSound();
      }, 2000);
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setTimer(30);
          setTimeout(() => {
            waitSound();
          }, 2000);
        } else {
          setGameOver(true);
          setResult("win");
        }
      }, 5000);
    }
  };

  useEffect(() => {
    if (fetchData && fetchData.length > 0) {
      const updatedQuestions = fetchData.map((questionData) => {
        const decodedQuestion = he.decode(questionData.question);
        const decodedCorrectAnswer = he.decode(questionData.correct_answer);
        const decodedIncorrectAnswers = questionData.incorrect_answers.map(
          (answer) => he.decode(answer)
        );

        const allAnswers = [decodedCorrectAnswer, ...decodedIncorrectAnswers];

        const shuffledAnswers = shuffleArray(allAnswers);

        return {
          question: decodedQuestion,
          answers: shuffledAnswers,
          correctAnswer: decodedCorrectAnswer,
        };
      });

      setQuestions(updatedQuestions);
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

  const handleStartClick = () => {
    clickSound();
    setSettings(false);
    setStart(true);
    fetchQuestions();
    setTimer(30);
    playSound();
    setTimeout(() => {
      waitSound();
    }, 5000);
  };

  const handleRestartClick = () => {
    setSettings(true);
    setStart(false);
    setGameOver(false);
    setCurrentQuestionIndex(0);
    clickSound();
  };

  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
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
                alt="Millionaire Game Logo"
                className="app-logo"
              />
              <div className="timer-container">
                <div className="timer">{timer}</div>
              </div>
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
            <div className="money-single">
              {moneyScale.map(
                (m) =>
                  currentQuestionIndex === m.id - 1 && (
                    <div key={m.id} className="money-single-item active">
                      <h1 className="number">{m.id}</h1>
                      <h1 className="amount">{m.amount}</h1>
                    </div>
                  )
              )}
            </div>
          </div>
        </>
      )}
      {gameOver && (
        <GameOver result={result} onRestartClick={handleRestartClick} />
      )}
    </div>
  );
}

export default App;
