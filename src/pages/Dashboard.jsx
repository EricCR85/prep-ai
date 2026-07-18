import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Mic } from "lucide-react";

export default function Dashboard() {
  const [feedbackHistory, setFeedbackHistory] = useState(() => {
    const savedFeedback = localStorage.getItem("prep-ai-feedback");
    return savedFeedback ? JSON.parse(savedFeedback) : [];
  });

  const clearHistory = () => {
    localStorage.removeItem("prep-ai-feedback");
    localStorage.removeItem("prep-ai-index");
    localStorage.removeItem("prep-ai-status");
    setFeedbackHistory([]);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Performance Dashboard
        </h1>
        {feedbackHistory.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
          >
            <Trash2 size={18} />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {feedbackHistory.length === 0 ? (
        <div className="bg-white p-10 rounded-lg shadow-sm border border-gray-200 text-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No history yet
          </h3>
          <p className="text-gray-500 mb-6">
            Start a mock interview to see your performance here.
          </p>
          <Link
            to="/practice"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Mic size={20} />
            <span>Go to Practice</span>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {feedbackHistory.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-blue-800">
                  Question {index + 1}
                </h3>

                {item.feedback?.score && (
                  <span
                    className={`text-sm font-bold px-3 py-1 rounded-full ${
                      item.feedback.score >= 85
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    Score: {item.feedback.score}/100
                  </span>
                )}
              </div>

              <p className="text-gray-700 mb-4 font-medium italic">
                "{item.question}"
              </p>


              <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-md space-y-2">
                <span className="font-bold text-xs uppercase tracking-wider text-blue-900 block">
                  AI Feedback Analysis
                </span>

                <p className="text-sm text-gray-700">
                  <strong className="text-blue-800">Summary:</strong>{" "}
                  {item.feedback?.generalFeedback || item.feedback}
                </p>

                {item.feedback?.strengths && (
                  <p className="text-sm text-gray-700">
                    <strong className="text-green-700">✓ Strengths:</strong>{" "}
                    {item.feedback.strengths}
                  </p>
                )}

                {item.feedback?.improvements && (
                  <p className="text-sm text-gray-700">
                    <strong className="text-amber-700">⚠ Improvements:</strong>{" "}
                    {item.feedback.improvements}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


