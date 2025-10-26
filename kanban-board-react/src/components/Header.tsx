import { Link, NavLink, Router } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import DropdownMenu, { type DropdownEntry } from "./DropdownMenu";
import Icon from "@mdi/react";
import { mdiChevronDown } from "@mdi/js";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../auth/firebase";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
  //   { to: "/about", label: "About" },
];

function Header() {
  const navigate = useNavigate();

  const signOutCallback = () => {
    signOut(auth);
    navigate("/login");
  };

  const dropdownEntries: DropdownEntry[] = [
    {
      key: "settings",
      label: "Settings",
      callback: () => {
        navigate("/settings");
      },
    },
    {
      key: "signOut",
      label: "Sign Out",
      callback: signOutCallback,
    },
  ];
  const { user } = useAuth();
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-semibold text-lg text-gray-800">
              Kanban Board
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-blue-600 ${
                    isActive ? "text-blue-600" : "text-gray-700"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <DropdownMenu entries={dropdownEntries}>
              <div className="cursor-pointer flex content-center ">
                <span>{user?.email}</span>

                <Icon path={mdiChevronDown} size={1} className="mt-[]" />
                {/* 
                <svg
                  className="w-5 h-5 "
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"></path>
                </svg> */}
              </div>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
