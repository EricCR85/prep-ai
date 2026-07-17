import { useEffect, useState, useCallback } from "react";
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
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [answerText, setAnswerText] = useState("");

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const handleReset = useCallback(() => {
    resetTranscript();
    setAnswerText("");
    setFeedback("");
    setTimeLeft(60);
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
        setAllFeedback((prev) => [
          ...prev,
          { question: questions[currentQuestionIndex], feedback: result },
        ]);
        setFeedback(result);
      } catch (err) {
        setError("Failed to get feedback. Please check your connection.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [answerText, questions, currentQuestionIndex],
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
    if (interviewStatus === "interviewing" && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && interviewStatus === "interviewing") {
      setTimeout(() => handleSubmit(true), 0);
    }
    return () => clearInterval(timer);
  }, [timeLeft, interviewStatus, handleSubmit]);

  useEffect(() => {
    if (listening) {
      setTimeout(() => setAnswerText(transcript), 0);
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

          <p className="text-xl font-medium mb-6">
            {questions[currentQuestionIndex]}
          </p>

          <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            className={`w-full bg-gray-100 p-4 rounded-lg mb-4 focus:outline-none border-2 transition-all duration-300 ${
              listening
                ? "border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse"
                : "border-transparent"
            }`}
            placeholder={
              listening
                ? "Listening to your response..."
                : "Click Start Speaking or type your answer here..."
            }
            rows={3}
          />

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
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg"
            >
              {loading ? "Analyzing..." : "Submit"}
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg"
            >
              Next
            </button>
          </div>

          {feedback && (
            <div
              aria-live="polite"
              className="bg-blue-50 p-4 mt-6 rounded border border-blue-200"
            >
              <span className="font-bold text-blue-900">AI Feedback:</span>
              <p className="text-blue-800 mt-1">{feedback}</p>
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
            Restart
          </button>
        </div>
      )}
    </div>
  );
}
