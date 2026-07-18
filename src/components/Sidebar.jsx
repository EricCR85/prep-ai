import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Mic } from "lucide-react";

export default function Sidebar({ theme }) {
  const location = useLocation();

  const menuItems = [
    { path: "/", name: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { path: "/practice", name: "Practice", icon: <Mic size={20} /> },
  ];

  return (
    <aside
      className={`w-64 border-r transition-all duration-300 p-6 flex flex-col justify-between ${
        theme === "dark"
          ? "bg-gray-800 border-gray-700 text-gray-100"
          : "bg-white border-gray-200 text-gray-800"
      }`}
    >
      <div>
        <div className="mb-8">
          <h2 className="text-xl font-black tracking-wider text-blue-500 uppercase">
            Prep AI
          </h2>
          <p className="text-xs text-gray-400 mt-1">Interview Simulator</p>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : theme === "dark"
                      ? "text-gray-400 hover:bg-gray-700/50 hover:text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t pt-4 border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-400 font-medium text-center">
          v1.2.0 • Stable Release
        </p>
      </div>
    </aside>
  );
}


