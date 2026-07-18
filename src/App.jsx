import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Practice from "./pages/Practice";

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("prep-ai-theme") || "light";
  });

  useEffect(() => {
    localStorage.setItem("prep-ai-theme", theme);
  }, [theme]);

  return (
    <div
      className={`flex min-h-screen transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      <Sidebar theme={theme} />

      <div className="flex-1 relative">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route
            path="/practice"
            element={<Practice theme={theme} setTheme={setTheme} />}
          />
        </Routes>
      </div>
    </div>
  );
}
