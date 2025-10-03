"use client";
import { useState, useEffect, useRef } from "react";
import { words } from "./words";

export default function TypingGame({ username, timeLimit, onBack }) {
  const [wordList, setWordList] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [input, setInput] = useState("");
  const [wpm, setWPM] = useState(0);
  const [errors, setErrors] = useState(0);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [wordStatus, setWordStatus] = useState([]);
  const inputRef = useRef(null);

  const generateWordList = () => {
    const list = [];
    let prevWord = null;
    for (let i = 0; i < 200; i++) {
      let newWord;
      do {
        newWord = words[Math.floor(Math.random() * words.length)];
      } while (newWord === prevWord);
      list.push(newWord);
      prevWord = newWord;
    }
    return list;
  };

  useEffect(() => {
    setWordList(generateWordList());
    setWordStatus([]);
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setTimeLeft(timeLimit);
    setFinished(false);
    setWordStatus([]);
  }, [timeLimit]);

  useEffect(() => {
    if (finished) return;
    if (timeLeft <= 0) {
      setFinished(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, finished]);

  const handleChange = (e) => {
    const value = e.target.value;
    if (value.endsWith(" ")) {
      const typedWord = value.trim();
      const isCorrect = typedWord === wordList[currentWordIndex];
      if (!isCorrect) setErrors(errors + 1);

      setWordStatus([...wordStatus, isCorrect]);
      setCurrentWordIndex(currentWordIndex + 1);
      setInput("");

      const correctWords = wordStatus.filter((w) => w).length + (isCorrect ? 1 : 0);
      const minutesPassed = (timeLimit - timeLeft) / 60;
      setWPM(minutesPassed > 0 ? Math.round(correctWords / minutesPassed) : 0);
    } else {
      setInput(value);
    }
  };

  const handleRetry = () => {
    setWordList(generateWordList());
    setWordStatus([]);
    setCurrentWordIndex(0);
    setInput("");
    setWPM(0);
    setErrors(0);
    setFinished(false);
    setTimeLeft(timeLimit);
    inputRef.current?.focus();
  };

  const progressPercent = ((timeLeft / timeLimit) * 100).toFixed(0);
  const totalTyped = wordStatus.length + (input.trim() ? 1 : 0);
  const accuracy = totalTyped > 0 ? Math.round(((totalTyped - errors) / totalTyped) * 100) : 100;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500 rounded-2xl shadow-2xl relative animate-fade-in font-mono">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-center mb-4 drop-shadow-lg">
        {username}'s Typing Challenge
      </h2>

      <div className="relative h-3 w-full bg-purple-300 rounded mb-4 overflow-hidden shadow-inner">
        <div
          className="absolute h-3 rounded bg-yellow-400 transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      <div className="flex justify-between mb-4 text-white font-semibold text-sm sm:text-base">
        <span>⏱ Time Left: {timeLeft}s</span>
        <span>⚡ WPM: {wpm}</span>
        <span>❌ Errors: {errors}</span>
        <span>🎯 Accuracy: {accuracy}%</span>
      </div>

      {!finished && (
        <>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-purple-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:bg-purple-700 dark:text-white mb-4 text-lg transition shadow-md placeholder-purple-200"
            placeholder="Start typing..."
            autoFocus
          />

          <div className="overflow-y-auto max-h-56 text-lg sm:text-xl mb-4 flex flex-wrap justify-center p-3 border border-purple-300 rounded-lg bg-purple-50 dark:bg-purple-900">
            {wordList.map((word, wIdx) =>
              word ? (
                <span
                  key={wIdx}
                  className={`mr-2 mb-2 px-1 py-0.5 rounded transition-all ${
                    wIdx === currentWordIndex ? "bg-yellow-100 shadow font-bold" : ""
                  }`}
                >
                  {word.split("").map((char, cIdx) => {
                    let color = "text-indigo-900 dark:text-indigo-100";
                    if (wIdx < currentWordIndex) {
                      color = wordStatus[wIdx] ? "text-green-500 font-bold" : "text-red-500 font-bold";
                    } else if (wIdx === currentWordIndex && cIdx < input.length) {
                      color = char === input[cIdx] ? "text-green-500 font-bold" : "text-red-500 font-bold";
                    }
                    return (
                      <span key={cIdx} className={color}>
                        {char}
                      </span>
                    );
                  })}
                </span>
              ) : null
            )}
          </div>
        </>
      )}

      {finished && (
        <div className="text-center mt-6 animate-fade-in">
          <p className="text-2xl sm:text-3xl text-white mb-2 drop-shadow-md">🎉 Time's Up!</p>
          <p className="text-white font-semibold mb-4 text-lg sm:text-xl">
            Your Score: ⚡ WPM {wpm}, ❌ Errors {errors}, 🎯 Accuracy {accuracy}%
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-green-400 text-white rounded-xl hover:bg-green-500 transition font-bold shadow-lg"
            >
              Retry
            </button>
            {onBack && (
              <button
                onClick={onBack}
                className="px-6 py-3 bg-purple-400 text-white rounded-xl hover:bg-purple-500 transition font-bold shadow-lg"
              >
                Home
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
