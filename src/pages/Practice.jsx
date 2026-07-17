import { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { getAiFeedback } from "../services/mockApi";

export default function Practice() {
  const savedStatus = localStorage.getItem("prep-ai-status");
  const [interviewStatus, setInterviewStatus] = useState(
    savedStatus === "interviewing" || savedStatus === "finished"
      ? savedStatus
      : "idle",
  );

  const [questions] = useState([
    "Tell me about your experience with React.",
    "Explain the difference between state and props.",
    "What is the Virtual DOM and how does it work?",
  ]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
    const savedIndex = localStorage.getItem("prep-ai-index");
    return savedIndex ? parseInt(savedIndex) : 0;
  });

  const [allFeedback, setAllFeedback] = useState(() => {
    const savedFeedback = localStorage.getItem("prep-ai-feedback");
    return savedFeedback ? JSON.parse(savedFeedback) : [];
  });

  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Added Error State
  const [timeLeft, setTimeLeft] = useState(60);
  const [answerText, setAnswerText] = useState("");

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

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
    if (interviewStatus === "interviewing" && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && interviewStatus === "interviewing") {
      handleSubmit(true);
    }
    return () => clearInterval(timer);
  }, [timeLeft, interviewStatus]);

  useEffect(() => {
    if (listening) {
      setAnswerText(transcript);
    }
  }, [transcript, listening]);

  const handleReset = () => {
    resetTranscript();
    setAnswerText("");
    setFeedback("");
    setTimeLeft(60);
  };

  const handleRestart = () => {
    localStorage.removeItem("prep-ai-index");
    localStorage.removeItem("prep-ai-feedback");
    localStorage.removeItem("prep-ai-status");
    setInterviewStatus("idle");
    setCurrentQuestionIndex(0);
    setAllFeedback([]);
    handleReset();
  };

  const handleSubmit = async (isAutoSubmit = false) => {
    if (!answerText && !isAutoSubmit) return;
    const textToSubmit = answerText || "No answer provided within time limit.";
    setLoading(true);
    setError(null);
    try {
      const result = await getAiFeedback(
        questions[currentQuestionIndex],
        textToSubmit,
      );
      setAllFeedback((prev) => [
        ...prev,
        { question: questions[currentQuestionIndex], feedback: result },
      ]);
      setFeedback(result);
    } catch (err) {
      setError("Failed to get feedback. Please check your connection.");
      console.error("Error getting feedback:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      handleReset();
    } else {
      setInterviewStatus("finished");
    }
  };

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
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-[100] animate-bounce">
          {error}
        </div>
      )}

      <h2 className="text-3xl font-bold text-gray-800 mb-6">Mock Interview</h2>

      {interviewStatus === "idle" && (
        <div className="bg-white p-10 rounded-lg shadow-sm border border-gray-200 text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to start?</h3>
          <button
            onClick={() => setInterviewStatus("interviewing")}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Start Interview
          </button>
        </div>
      )}

      {interviewStatus === "interviewing" && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
              style={{
                width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
              }}
            ></div>
          </div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-500">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
            <div
              className={`font-mono font-bold ${timeLeft < 10 ? "text-red-600 animate-pulse" : "text-blue-600"}`}
            >
              Time: {timeLeft}s
            </div>
          </div>
          <p className="text-xl font-medium mb-6">
            {questions[currentQuestionIndex]}
          </p>
          <div className="bg-gray-100 p-4 rounded-lg min-h-[100px] mb-4 flex items-start relative overflow-hidden">
            <textarea
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder={
                listening
                  ? "Listening..."
                  : "Click Start Speaking or type your answer here..."
              }
              className="relative z-10 w-full bg-transparent text-gray-800 font-medium resize-none focus:outline-none"
              rows={3}
            />
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() =>
                listening
                  ? SpeechRecognition.stopListening()
                  : SpeechRecognition.startListening({ continuous: true })
              }
              className={`px-6 py-2 rounded-lg text-white ${listening ? "bg-red-600" : "bg-blue-600"}`}
            >
              {listening ? "Stop Speaking" : "Start Speaking"}
            </button>
            <button
              onClick={() => handleSubmit(false)}
              disabled={!answerText || loading}
              className="flex items-center justify-center px-6 py-2 bg-green-600 text-white rounded-lg disabled:bg-gray-400 transition-colors"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                "Submit Answer"
              )}
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg"
            >
              Next Question
            </button>
          </div>
          {feedback && (
            <div
              aria-live="polite"
              className="bg-blue-50 p-4 mt-6 rounded border border-blue-200"
            >
              <span className="font-bold">AI Feedback:</span> {feedback}
            </div>
          )}
        </div>
      )}

      {interviewStatus === "finished" && (
        <div className="bg-white p-10 rounded-lg shadow-sm border border-gray-200 text-center">
          <h2 className="text-2xl font-bold mb-4">Interview Complete!</h2>
          <button
            onClick={handleRestart}
            className="px-6 py-2 bg-gray-800 text-white rounded-lg"
          >
            Restart Session
          </button>
        </div>
      )}
    </div>
  );
}


