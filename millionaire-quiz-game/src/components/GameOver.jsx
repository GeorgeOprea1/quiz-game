import "../styles/GameOver.css";

const GameOver = ({ result, onRestartClick }) => {
  return (
    <div className="game-over-container">
      <img src="/millionaire.svg" alt="logo" className="logo" />
      <div className="game-over-text">
        {result === "win" && <p>Congratulations! You won!</p>}
        {result === "lose" && <p>Game Over! Better luck next time!</p>}
        {result === "time" && <p>Game Over! Time&apos;s up!</p>}
      </div>
      <button id="restart-btn" onClick={onRestartClick}>
        Restart
      </button>
    </div>
  );
};
export default GameOver;
