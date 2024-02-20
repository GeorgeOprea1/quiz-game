import { useEffect, useState } from "react";
import "../styles/Settings.css";
function Settings({
  loading,
  questionCategory,
  options,
  questionDifficulty,
  handleCategoryChange,
  handleDifficultyChange,
  handleStartClick,
}) {
  if (!loading) {
    return (
      <div className="settings-container">
        <div className="logo-container">
          <img src="/millionaire.svg" alt="logo" className="logo" />
        </div>
        <div className="selections-container">
          <div className="category-container">
            <label htmlFor="category-select">Select Category:</label>
            <select
              id="category-select"
              value={questionCategory}
              onChange={handleCategoryChange}
            >
              <option>All</option>
              {options &&
                options.map((option) => (
                  <option value={option.id} key={option.id}>
                    {option.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="difficulty-container">
            <label htmlFor="difficulty-select">Select Difficulty:</label>
            <select
              value={questionDifficulty}
              onChange={handleDifficultyChange}
              id="difficulty-select"
            >
              <option value="" key="difficulty-0">
                All
              </option>
              <option value="easy" key="difficulty-1">
                Easy
              </option>
              <option value="medium" key="difficulty-2">
                Medium
              </option>
              <option value="hard" key="difficulty-3">
                Hard
              </option>
            </select>
          </div>
        </div>
        <div className="button-container">
          <button id="getStarted-btn" onClick={handleStartClick}>
            Get Started!
          </button>
        </div>
      </div>
    );
  }
  return <p className="loading">LOADING...</p>;
}
export default Settings;
