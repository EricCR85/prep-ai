import { Link } from "lucide-react";

export default function Header() {
  return (
    <header className="md:hidden bg-white border-b border-gray-200 p-4 sticky top-0 z-50 flex items-center justify-between shadow-sm">
      <Link to="/" className="hover: opacity-80 transition-opacity">
        <h1 className="text-2xl font-bold text-blue-600">PrepAI</h1>
      </Link>
    </header>
  );
}
