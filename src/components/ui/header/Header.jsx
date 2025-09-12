import React from "react";
import { Link } from "react-router-dom";

import Button from "../button/Button";

const Header = () => {
  return (
    <header className="w-full">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0">
            <img
              src="/logo.svg"
              alt="Abuja Spot & Bar Logo"
              className="h-12 md:h-24 w-auto"
            />
          </div>

          <nav className="hidden md:flex items-center">
            <div className="bg-white rounded-full px-5 py-4">
              <ul className="flex items-center space-x-1">
                <li>
                  <Link
                    to="#"
                    className="px-6 py-2 bg-orange-400 text-white rounded-full font-medium hover:bg-orange-500 transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="px-6 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Menu
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="px-6 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </nav>

          <div className="flex-shrink-0">
            <Link to="#">
              <Button size="lg">Order Now</Button>
            </Link>
          </div>

          <div className="md:hidden">
            <button className="text-gray-700 hover:text-gray-900">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="md:hidden mt-4 bg-white rounded-lg shadow-lg p-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="#"
                className="block px-4 py-2 bg-orange-400 text-white rounded-lg font-medium text-center"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-center transition-colors"
              >
                Menu
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-center transition-colors"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
