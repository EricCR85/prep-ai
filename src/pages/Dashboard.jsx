import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trash2, Mic } from "lucide-react";

export default function Dashboard() {
  const [theme] = useState(() => {
    return localStorage.getItem("prep-ai-theme") || "light";
  });

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
    <div
      className={`min-h-screen p-8 transition-colors duration-300 ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Performance History Feed
          </h1>
          {feedbackHistory.length > 0 && (
            <button
              onClick={clearHistory}
              className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 rounded-lg hover:opacity-90 transition"
            >
              <Trash2 size={18} />
              <span className="text-xs font-bold uppercase">Wipe Logs</span>
            </button>
          )}
        </div>

        {feedbackHistory.length === 0 ? (
          <div
            className={`p-10 rounded-xl shadow-sm border text-center ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
          >
            <h3 className="text-xl font-bold mb-1">
              No execution logs available
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              Your evaluated answers will populate this metric area.
            </p>
            <Link
              to="/practice"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
            >
              <Mic size={18} />
              <span>Launch Terminal</span>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {feedbackHistory.map((item, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl shadow-sm border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm uppercase tracking-wider font-extrabold text-blue-500">
                    Question Segment {index + 1}
                  </h3>

                  {item.feedback?.score && (
                    <span
                      className={`text-xs font-black px-3 py-1 rounded-md ${
                        item.feedback.score >= 85
                          ? "bg-green-500 text-white"
                          : "bg-yellow-500 text-gray-900"
                      }`}
                    >
                      SCORE: {item.feedback.score}/100
                    </span>
                  )}
                </div>

                <p className="text-base font-medium mb-4 italic leading-relaxed">
                  "{item.question}"
                </p>

                <div
                  className={`p-4 rounded-lg space-y-2 border ${theme === "dark" ? "bg-gray-900/50 border-gray-700" : "bg-gray-50 border-gray-100"}`}
                >
                  <p className="text-sm">
                    <strong className="text-blue-500">Metric Summary:</strong>{" "}
                    {item.feedback?.generalFeedback || item.feedback}
                  </p>

                  {item.feedback?.strengths && (
                    <p className="text-sm">
                      <strong className="text-green-500">
                        ✓ Observed Strengths:
                      </strong>{" "}
                      {item.feedback.strengths}
                    </p>
                  )}

                  {item.feedback?.improvements && (
                    <p className="text-sm">
                      <strong className="text-amber-500">
                        ⚠ Structural Adjustments:
                      </strong>{" "}
                      {item.feedback.improvements}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


