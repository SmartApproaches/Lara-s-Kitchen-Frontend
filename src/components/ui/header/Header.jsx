import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Button from "../button/Button";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "Contact Us", path: "/contact" },
  ];

  return (
    <header className="fixed top-0 right-0 z-50 w-full">
      <div className="mx-auto max-w-7xl px-4 py-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <NavLink to="/">
              <img
                src="/logo.svg"
                alt="Abuja Spot & Bar Logo"
                className="h-10 w-auto sm:h-12 md:h-16 lg:h-20"
              />
            </NavLink>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden items-center md:flex">
            <div className="rounded-full bg-white px-5 py-3 shadow-md">
              <ul className="flex items-center space-x-1">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `rounded-full px-6 py-2 font-medium transition-colors ${
                          isActive
                            ? "bg-orange-400 text-white"
                            : "text-gray-700 hover:text-gray-900"
                        }`
                      }
                    >
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* CTA */}
          <div className="hidden md:flex">
            <a
              href="https://apps.apple.com/us/app/laras-kitchen/id6753684107"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg">Order Now</Button>
            </a>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              {menuOpen ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="mt-6 flex flex-col items-center space-y-6 bg-white py-5 md:hidden">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `text-lg font-medium ${
                    isActive ? "rounded-full bg-orange-400 px-6 py-2 text-white" : "text-gray-800"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
            <a
              href="https://apps.apple.com/us/app/laras-kitchen/id6753684107"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-green-800 px-6 py-2 font-medium text-white"
              onClick={() => setMenuOpen(false)}
            >
              Order Now
            </a>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
