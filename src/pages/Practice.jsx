import { useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

export default function Practice() {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="p-8 text-red-600">
        Browser doesn't support speech recognition.
      </div>
    );
  }

  const handleReset = () => {
    resetTranscript();
    setFeedback("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback("");

    setTimeout(() => {
      setFeedback(
        "Good answer! Try adding a specific React project you worked on and explaining what you personally built.",
      );
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Mock Interview</h2>

      <div className="flex items-center mb-6">
        <div
          className={`h-3 w-3 rounded-full mr-2 ${listening ? "bg-red-500 animate-pulse" : "bg-gray-300"}`}
        />
        <span className="text-sm font-medium text-gray-500">
          {listening ? "Microphone Active" : "Microphone Idle"}
        </span>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Question:</h3>
        <p className="text-xl text-gray-900">
          Tell me about your experience with React.
        </p>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg mb-4 min-h-[100px]">
        <p className="text-gray-700">
          {transcript || "Your answer will appear here..."}
        </p>
      </div>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => {
            if (listening) {
              SpeechRecognition.stopListening();
            } else {
              SpeechRecognition.startListening({
                continuous: true,
                language: "en-US",
              });
            }
          }}
          className={`px-6 py-2 rounded-lg text-white ${listening ? "bg-red-600" : "bg-blue-600"}`}
        >
          {listening ? "Stop Listening" : "Start Speaking"}
        </button>

        <button
          onClick={handleSubmit}
          disabled={!transcript || loading}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
        >
          {loading ? "Analyzing..." : "Submit Answer"}
        </button>

        <button
          onClick={handleReset}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Reset
        </button>
      </div>

      {feedback && (
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="font-bold text-blue-800">AI Feedback:</h3>
          <p className="text-blue-700">{feedback}</p>
        </div>
      )}
    </div>
  );
}
