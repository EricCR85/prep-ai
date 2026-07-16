import { LayoutDashboard, Mic } from "lucide-react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-6 h-screen">
      <h1 className="text-2xl font-bold text-blue-600 mb-8">PrepAI</h1>
      <nav className="space-y-4">
        <Link to="/" className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 w-full p-2">
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>
        <Link to="/practice" className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 w-full p-2">
          <Mic size={20} />
          <span>Practice</span>
        </Link>
      </nav>
    </aside>
  );
}
