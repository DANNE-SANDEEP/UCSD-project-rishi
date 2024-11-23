import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { Menu, X } from "lucide-react";

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleAdminLogin = () => {
    navigate("/login");
    closeMobileMenu();
  };

  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/home");
  };

  return (
    <header className="bg-gray-900/90 text-white p-4 relative">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo and Mobile Menu Toggle */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center">
            <img
              src={logo}
              alt="UCSD Project Rishi Logo"
              className="h-10 md:h-12 mr-4 rounded-full"
            />
            <h1 className="text-lg md:text-xl font-bold hidden md:block">
              <Link to="/home" className="hover:text-blue-200 transition">
                UCSD Project Rishi
              </Link>
            </h1>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden focus:outline-none"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-10 items-center">
            <li>
              <Link to="/home" className="hover:text-blue-200 transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/map" className="hover:text-blue-200 transition">
                Map
              </Link>
            </li>
            <li>
              <Link
                to="/survey-info"
                className="hover:text-blue-200 transition"
              >
                Survey
              </Link>
            </li>
            <li>
              <Link to="/projects" className="hover:text-blue-200 transition">
                Projects
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-blue-200 transition">
                Contact
              </Link>
            </li>
            <li>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/admin"
                    className="mr-4 hover:text-black transition"
                  >
                    Admin Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-white text-black px-4 py-2 rounded hover:bg-blue-100 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={handleAdminLogin}
                  className="bg-white text-black px-4 py-2 rounded hover:bg-blue-100 transition ml-4"
                >
                  Admin Login
                </button>
              )}
            </li>
          </ul>
        </nav>

        {/* Mobile Navigation Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-blue-600 z-50">
            <nav>
              <ul className="flex flex-col items-center space-y-4 py-6">
                <li>
                  <Link
                    to="/home"
                    onClick={closeMobileMenu}
                    className="hover:text-blue-200 transition"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/map"
                    onClick={closeMobileMenu}
                    className="hover:text-blue-200 transition"
                  >
                    Map
                  </Link>
                </li>
                <li>
                  <Link
                    to="/survey-info"
                    onClick={closeMobileMenu}
                    className="hover:text-blue-200 transition"
                  >
                    Survey
                  </Link>
                </li>
                <li>
                  <Link
                    to="/projects"
                    onClick={closeMobileMenu}
                    className="hover:text-blue-200 transition"
                  >
                    Projects
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    onClick={closeMobileMenu}
                    className="hover:text-blue-200 transition"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/admin"
                        onClick={closeMobileMenu}
                        className="mr-4 hover:text-blue-200 transition"
                      >
                        Admin Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100 transition mt-2"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleAdminLogin}
                      className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100 transition"
                    >
                      Admin Login
                    </button>
                  )}
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
