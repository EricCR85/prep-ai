import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { getAiFeedback, roleQuestions } from "../services/mockApi";

export default function Practice() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("prep-ai-theme") || "light";
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem("prep-ai-role") || "Frontend Engineer";
  });

  const [savedStatus, setSavedStatus] = useState(() => {
    return localStorage.getItem("prep-ai-status");
  });

  const [interviewStatus, setInterviewStatus] = useState(
    savedStatus === "interviewing" || savedStatus === "finished"
      ? savedStatus
      : "idle",
  );

  const [questions, setQuestions] = useState(() => {
    return roleQuestions[role];
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
    const savedIndex = localStorage.getItem("prep-ai-index");
    return savedIndex ? parseInt(savedIndex) : 0;
  });

  const [allFeedback, setAllFeedback] = useState(() => {
    const savedFeedback = localStorage.getItem("prep-ai-feedback");
    return savedFeedback ? JSON.parse(savedFeedback) : [];
  });

  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(90);
  const [answerText, setAnswerText] = useState("");

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    setQuestions(roleQuestions[role]);
    localStorage.setItem("prep-ai-role", role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem("prep-ai-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleReset = useCallback(() => {
    resetTranscript();
    setAnswerText("");
    setFeedback(null);
    setTimeLeft(90);
  }, [resetTranscript]);

  const handleSubmit = useCallback(
    async (isAutoSubmit = false) => {
      if (!answerText && !isAutoSubmit) return;

      const textToSubmit =
        answerText || "No response provided within constraints.";
      setLoading(true);
      setError(null);

      try {
        const result = await getAiFeedback(
          questions[currentQuestionIndex],
          textToSubmit,
        );
        setFeedback(result);

        const updatedFeedback = [
          ...allFeedback,
          { question: questions[currentQuestionIndex], feedback: result },
        ];
        setAllFeedback(updatedFeedback);
      } catch (err) {
        setError(
          "Network error encountered evaluating your input. Please retry.",
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [answerText, questions, currentQuestionIndex, allFeedback],
  );

  const handleRestart = () => {
    localStorage.removeItem("prep-ai-index");
    localStorage.removeItem("prep-ai-feedback");
    localStorage.removeItem("prep-ai-status");
    setInterviewStatus("idle");
    setCurrentQuestionIndex(0);
    setAllFeedback([]);
    handleReset();
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      handleReset();
    } else {
      setInterviewStatus("finished");
    }
  };

  useEffect(() => {
    localStorage.setItem("prep-ai-index", currentQuestionIndex);
    localStorage.setItem("prep-ai-feedback", JSON.stringify(allFeedback));
    localStorage.setItem("prep-ai-status", interviewStatus);
  }, [currentQuestionIndex, allFeedback, interviewStatus]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    let timer;
    if (
      interviewStatus === "interviewing" &&
      timeLeft > 0 &&
      !loading &&
      !feedback
    ) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && interviewStatus === "interviewing") {
      handleSubmit(true);
    }
    return () => clearInterval(timer);
  }, [timeLeft, interviewStatus, handleSubmit, loading, feedback]);

  useEffect(() => {
    if (listening) {
      setAnswerText(transcript);
    }
  }, [transcript, listening]);

  const calculateOverallScore = () => {
    if (allFeedback.length === 0) return 0;
    const sum = allFeedback.reduce(
      (acc, curr) => acc + (curr.feedback?.score || 0),
      0,
    );
    return Math.round(sum / allFeedback.length);
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="p-8 text-center text-red-600 font-bold">
        Browser speech capabilities unverified. Please utilize Chromium engines.
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-8 transition-colors duration-300 ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}
    >
      <div className="absolute top-6 right-8">
        <button
          onClick={toggleTheme}
          className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition ${theme === "dark" ? "bg-gray-800 text-yellow-400 border border-gray-700" : "bg-white text-gray-800 shadow-sm border"}`}
        >
          {theme === "dark" ? "☀️ LIGHT MODE" : "🌙 DARK MODE"}
        </button>
      </div>

      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-bounce">
          {error}
        </div>
      )}

      <h2 className="text-3xl font-extrabold mb-6 tracking-tight">
        AI Interview Terminal
      </h2>

      {interviewStatus === "idle" && (
        <div
          className={`p-10 rounded-xl shadow-sm border text-center ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
        >
          <h3 className="text-2xl font-bold mb-4">Select Target Job Target</h3>

          <div className="mb-6 max-w-xs mx-auto text-left">
            <label
              className={`block text-xs font-bold tracking-wide uppercase mb-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
            >
              Job Track Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={`w-full p-3 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 border ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-300 text-gray-900"}`}
            >
              <option value="Frontend Engineer">Frontend Engineer</option>
              <option value="Backend Engineer">Backend Engineer</option>
              <option value="Full Stack Engineer">Full Stack Engineer</option>
            </select>
          </div>

          <button
            onClick={() => setInterviewStatus("interviewing")}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-md transition-all duration-200"
          >
            Launch Interview Session
          </button>
        </div>
      )}

      {interviewStatus === "interviewing" && (
        <div
          className={`p-6 rounded-xl shadow-sm border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
        >
          <div className="flex justify-between items-center mb-6">
            <div className="w-2/3 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                }}
              ></div>
            </div>
            <span
              className={`text-xs font-extrabold uppercase px-3 py-1.5 rounded-full ${timeLeft <= 15 ? "bg-red-100 text-red-600 animate-pulse" : theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}
            >
              ⏱️ {timeLeft}s remaining
            </span>
          </div>

          <p className="text-xl font-semibold mb-4 leading-snug">
            <span className="text-blue-500 font-bold mr-2">
              Q{currentQuestionIndex + 1}:
            </span>
            {questions[currentQuestionIndex]}
          </p>

          <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            className={`w-full p-4 rounded-lg mb-4 border font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${theme === "dark" ? "bg-gray-900 border-gray-600 text-white placeholder-gray-500" : "bg-gray-50 border-gray-300 text-gray-900"}`}
            placeholder={
              listening
                ? "Microphone active. Transcribing speech..."
                : "Click Speak or type your comprehensive response..."
            }
            rows={4}
          />

          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => {
                listening
                  ? SpeechRecognition.stopListening()
                  : SpeechRecognition.startListening({ continuous: true });
              }}
              className={`px-6 py-2.5 rounded-lg text-white font-bold transition-all ${listening ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {listening ? "⏹ Stop Capture" : "🎙 Start Speaking"}
            </button>

            <button
              onClick={() => handleSubmit(false)}
              disabled={loading || !!feedback}
              className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 disabled:opacity-40 transition"
            >
              {loading ? "⌛ Processing Matrix..." : "✓ Submit Response"}
            </button>

            {feedback && (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition"
              >
                Advance Question →
              </button>
            )}
          </div>

          {feedback && (
            <div
              className={`mt-6 p-5 border rounded-xl space-y-3 animate-fadeIn ${theme === "dark" ? "bg-blue-950/40 border-blue-900" : "bg-blue-50/60 border-blue-200"}`}
            >
              <div className="flex justify-between items-center border-b pb-2 border-blue-200 dark:border-blue-900">
                <span className="font-extrabold text-blue-400 text-sm uppercase tracking-wider">
                  AI Evaluation Matrix
                </span>
                <span
                  className={`text-base font-black px-3 py-1 rounded-md ${feedback.score >= 85 ? "bg-green-500 text-white" : "bg-yellow-500 text-gray-900"}`}
                >
                  Score: {feedback.score}/100
                </span>
              </div>
              <p className="text-sm leading-relaxed">
                <strong className="text-blue-400">Analysis:</strong>{" "}
                {feedback.generalFeedback}
              </p>
              <p className="text-sm leading-relaxed">
                <strong className="text-green-400">✓ Strengths:</strong>{" "}
                {feedback.strengths}
              </p>
              <p className="text-sm leading-relaxed">
                <strong className="text-amber-400">
                  ⚠ Target Adjustments:
                </strong>{" "}
                {feedback.improvements}
              </p>
            </div>
          )}
        </div>
      )}

      {interviewStatus === "finished" && (
        <div
          className={`p-10 rounded-xl shadow-sm border text-center ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
        >
          <h2 className="text-3xl font-black text-emerald-500 mb-2">
            Interview Complete!
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            Metrics synchronized with local storage.
          </p>

          <div className="max-w-xs mx-auto mb-8 p-6 border rounded-xl bg-gray-900 border-gray-700 text-white shadow-inner">
            <span className="text-xs uppercase font-extrabold tracking-widest text-gray-400 block mb-1">
              Cumulative Grade
            </span>
            <div className="text-5xl font-black text-blue-500">
              {calculateOverallScore()}%
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={handleRestart}
              className="px-6 py-2.5 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 transition"
            >
              Reset Session
            </button>
            <Link
              to="/"
              className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition inline-block"
            >
              View Analytics Feed
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}


