import { useEffect, useState } from "react";
import "../styles/Settings.css";
function Settings({
  loading,
  questionCategory,
  options,
  questionDifficulty,
  questionType,
  handleTypeChange,
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
        <div className="category-container">
          <h2>Select Category:</h2>
          <select value={questionCategory} onChange={handleCategoryChange}>
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
          <h2>Select Difficulty:</h2>
          <select value={questionDifficulty} onChange={handleDifficultyChange}>
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
        <div className="question-type-container">
          <h2>Select Question Type:</h2>
          <select value={questionType} onChange={handleTypeChange}>
            <option value="" key="type-0">
              All
            </option>
            <option value="multiple" key="type-1">
              Multiple Choice
            </option>
            <option value="boolean" key="type-2">
              True/False
            </option>
          </select>
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
