import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { getAiFeedback, difficultyQuestions } from "../services/mockApi";

export default function Practice() {

  const [difficulty, setDifficulty] = useState(() => {
    return localStorage.getItem("prep-ai-difficulty") || "Intermediate";
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
    return difficultyQuestions[difficulty];
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
    setQuestions(difficultyQuestions[difficulty]);
    localStorage.setItem("prep-ai-difficulty", difficulty);
  }, [difficulty]);

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
        answerText || "No answer provided within time limit.";
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
        setError("Failed to get feedback. Please check your connection.");
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
      const timer = setTimeout(() => setError(null), 3000);
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

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="p-8 text-center text-red-600 font-bold">
        Browser doesn't support speech recognition.
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto relative">
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
          {error}
        </div>
      )}

      <h2 className="text-3xl font-bold text-gray-800 mb-6">Mock Interview</h2>

      {interviewStatus === "idle" && (
        <div className="bg-white p-10 rounded-lg shadow-sm border border-gray-200 text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to start?</h3>

          <div className="mb-6 max-w-xs mx-auto">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Difficulty Level
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <button
            onClick={() => setInterviewStatus("interviewing")}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
          >
            Start Interview ({difficulty})
          </button>
        </div>
      )}

      {interviewStatus === "interviewing" && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                style={{
                  width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                }}
              ></div>
            </div>
            <span
              className={`text-sm font-bold px-3 py-1 rounded-full ${timeLeft <= 15 ? "bg-red-100 text-red-600 animate-pulse" : "bg-gray-100 text-gray-600"}`}
            >
              ⏱️ {timeLeft}s left
            </span>
          </div>

          <p className="text-xl font-medium mb-6">
            {questions[currentQuestionIndex]}
          </p>

          <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            className="w-full bg-gray-50 p-4 rounded-lg mb-4 border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder={
              listening
                ? "Listening to your response..."
                : "Click Start Speaking or type your answer here..."
            }
            rows={4}
          />

          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => {
                listening
                  ? SpeechRecognition.stopListening()
                  : SpeechRecognition.startListening({ continuous: true });
              }}
              className={`px-6 py-2 rounded-lg text-white font-medium transition ${listening ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {listening ? "Stop Speaking" : "Start Speaking"}
            </button>

            <button
              onClick={() => handleSubmit(false)}
              disabled={loading || !!feedback}
              className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
            >
              {loading ? "Analyzing..." : "Submit"}
            </button>

            {feedback && (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition"
              >
                Next Question
              </button>
            )}
          </div>

          {feedback && (
            <div className="mt-6 p-5 border border-blue-200 bg-blue-50/50 rounded-xl space-y-3 animate-fadeIn">
              <div className="flex justify-between items-center border-b border-blue-100 pb-2">
                <span className="font-bold text-blue-900 text-lg">
                  AI Feedback Analysis
                </span>
                <span
                  className={`text-xl font-black px-3 py-1 rounded-lg ${feedback.score >= 85 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                >
                  Score: {feedback.score}/100
                </span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                <strong className="text-blue-9CED">Summary:</strong>{" "}
                {feedback.generalFeedback}
              </p>
              <p className="text-gray-700 text-sm leading-relaxed">
                <strong className="text-green-700">✓ Key Strengths:</strong>{" "}
                {feedback.strengths}
              </p>
              <p className="text-gray-700 text-sm leading-relaxed">
                <strong className="text-amber-700">
                  ⚠ Constructive Suggestions:
                </strong>{" "}
                {feedback.improvements}
              </p>
            </div>
          )}
        </div>
      )}

      {interviewStatus === "finished" && (
        <div className="bg-white p-10 rounded-lg shadow-sm border border-gray-200 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Interview Complete!
          </h2>
          <p className="text-gray-600 mb-6">
            Your answers and scores have been submitted to your progress logs.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleRestart}
              className="px-6 py-2 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-900 transition"
            >
              Restart Session
            </button>
            <Link
              to="/"
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition inline-block"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}


