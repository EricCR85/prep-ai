import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import TrackCard from "./components/TrackCard";
import Practice from "./pages/Practice";



export default function App() {
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
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1">
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
                    />
                  ))}
                </div>
              </div>
            }
          />
          <Route path="/practice" element={<Practice />} />
        </Routes>
      </main>
    </div>
  );
}


