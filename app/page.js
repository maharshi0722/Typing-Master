"use client";
import { useState } from "react";
import TypingGame from "../components/TypingGame";

export default function Home() {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [timer, setTimer] = useState(null);

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    setStep(2);
  };

  const handleStartTyping = () => setStep(3);
  const handleBack = () => setStep(1);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 flex flex-col items-center justify-center p-6 space-y-10 font-inter">
      
      <h1 className="text-5xl sm:text-6xl font-extrabold text-white text-center drop-shadow-xl animate-[fadeIn_1.5s_ease-in-out]">
        Sentient AGI Typing Challenge
      </h1>

      {step === 1 && (
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 flex flex-col gap-6 animate-[fadeInUp_1.2s_ease-out]">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center">
            Enter Your Username
          </h2>
          <form onSubmit={handleUsernameSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Enter your username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-lg transition-shadow shadow-md"
            />
            <button
              type="submit"
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:scale-105 transform transition-all font-bold text-lg shadow-lg"
            >
              Submit
            </button>
          </form>
        </div>
      )}

      {step === 2 && (
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 text-center animate-[fadeInUp_1.2s_ease-out] flex flex-col items-center gap-6">
          <img
            src={`https://pbs.twimg.com/profile_images/1859727094789660672/h7RM1LNu_400x400.jpg`}
            alt={username}
            className="w-32 h-32 rounded-full shadow-xl border-4 border-white dark:border-gray-600 animate-[pulse_2s_ease-in-out_infinite]"
          />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{username}</h2>
          <p className="text-gray-700 dark:text-gray-300">Select your timer:</p>
          <div className="flex justify-center gap-4 mt-2 flex-wrap">
            {[15, 30, 45, 60].map((t) => (
              <button
                key={t}
                onClick={() => setTimer(t)}
                className={`px-5 py-2 rounded-xl font-bold transition-all duration-300 ${
                  timer === t
                    ? "bg-green-500 text-white shadow-lg scale-105 transform"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 hover:scale-105 transform"
                }`}
              >
                {t}s
              </button>
            ))}
          </div>
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleStartTyping}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:scale-105 transform transition font-bold shadow-md"
            >
              Start Typing
            </button>
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-gray-400 text-white rounded-xl hover:scale-105 transform transition font-bold shadow-md"
            >
              Back
            </button>
          </div>
        </div>
      )}

      {step === 3 && <TypingGame username={username} timeLimit={timer} onBack={handleBack} />}
    </div>
  );
}
