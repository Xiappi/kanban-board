import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left side: logo or brand */}
        <Link
          to="/"
          className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
        >
          <span className="font-semibold text-sm">Kanban Board</span>
        </Link>

        {/* Center: nav links */}
        <nav className="flex gap-4 text-sm text-gray-600">
          <Link to="/about" className="hover:text-blue-600 transition-colors">
            About
          </Link>
          <Link to="/contact" className="hover:text-blue-600 transition-colors">
            Contact
          </Link>
          <Link to="/privacy" className="hover:text-blue-600 transition-colors">
            Privacy
          </Link>
        </nav>

        {/* Right side: copyright */}
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} Kanban Board. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
