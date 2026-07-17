import { Routes, Route, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import TrackCard from "./components/TrackCard";
import Practice from "./pages/Practice";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const navigate = useNavigate();
  const tracks = [
    {
      title: "Software Engineering",
      description: "Frontend, Backend, and Fullstack.",
    },
    {
      title: "Data Science",
      description: "ML, Statistics, and Data Analysis.",
    },
    {
      title: "Product Management",
      description: "Strategy, User Stories, and KPIs.",
    },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full w-full">
        <Header />
        <main className="flex-1 overflow-y-auto pd-20 md:pb-0">
          <Routes>
            <Route
              path="/"
              element={
                <div className="p-8">
                  <header className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">
                      Welcome Back, User
                    </h2>
                    <p className="text-gray-600">
                      Select a career track to start your mock interview.
                    </p>
                  </header>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tracks.map((track, index) => (
                      <TrackCard
                        key={index}
                        title={track.title}
                        description={track.description}
                        onClick={() => navigate("/practice")}
                      />
                    ))}
                  </div>
                </div>
              }
            />
            <Route path="/practice" element={<Practice />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
