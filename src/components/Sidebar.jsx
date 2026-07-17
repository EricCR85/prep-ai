import { LayoutDashboard, Mic } from "lucide-react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-3 z-50 md:relative md:w-64 md:border-t-0 md:border-r md:p-6 md:h-screen flex md:flex-col justify-around md:justify-start">
      <Link
        to="/"
        className="hidden md:block hover:opacity-80 transition-opacity mb-8"
      >
        <h1 className="text-2xl font-bold text-blue-600">PrepAI</h1>
      </Link>

      <nav className="flex flex-row md:flex-col w-full justify-around md:justify-start md:space-y-4">
        <Link
          to="/dashboard"
          className="flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-3 text-gray-700 hover:text-blue-600 p-2 md:rounded-lg transition-colors"
        >
          <LayoutDashboard className="w-6 h-6 md:w-5 md:h-5" />
          <span className="text-[10px] md:text-base font-medium md:font-normal">
            Dashboard
          </span>
        </Link>
        <Link
          to="/practice"
          className="flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-3 text-gray-700 hover:text-blue-600 p-2 md:rounded-lg transition-colors"
        >
          <Mic className="w-6 h-6 md:w-5 md:h-5" />
          <span className="text-[10px] md:text-base font-medium md:font-normal">
            Practice
          </span>
        </Link>
      </nav>
    </aside>
  );
}
