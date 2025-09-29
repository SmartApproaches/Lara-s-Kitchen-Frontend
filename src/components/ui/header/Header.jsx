// import React from "react";
// import { Link } from "react-router-dom";

// import Button from "../button/Button";

// const Header = () => {
//   return (
//     <header className="fixed top-0 right-0 z-50 w-full">
//       <div className="mx-auto max-w-7xl px-4 py-4 md:px-6 lg:px-8">
//         <div className="flex items-center justify-between">
//           <div className="flex-shrink-0">
//             <img src="/logo.svg" alt="Abuja Spot & Bar Logo" className="h-12 w-auto md:h-24" />
//           </div>

//           <nav className="hidden items-center md:flex">
//             <div className="rounded-full bg-white px-5 py-4">
//               <ul className="flex items-center space-x-1">
//                 <li>
//                   <Link
//                     to="#"
//                     className="rounded-full bg-orange-400 px-6 py-2 font-medium text-white transition-colors hover:bg-orange-500"
//                   >
//                     Home
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="#"
//                     className="px-6 py-2 text-gray-700 transition-colors hover:text-gray-900"
//                   >
//                     Menu
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="#"
//                     className="px-6 py-2 text-gray-700 transition-colors hover:text-gray-900"
//                   >
//                     Contact Us
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//           </nav>

//           <div className="flex-shrink-0">
//             <Link to="#">
//               <Button size="lg">Order Now</Button>
//             </Link>
//           </div>

//           <div className="md:hidden">
//             <button className="text-gray-700 hover:text-gray-900">
//               <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M4 6h16M4 12h16M4 18h16"
//                 />
//               </svg>
//             </button>
//           </div>
//         </div>

//         <div className="mt-4 rounded-lg bg-white p-4 shadow-lg md:hidden">
//           <ul className="space-y-2">
//             <li>
//               <Link
//                 to="#"
//                 className="block rounded-lg bg-orange-400 px-4 py-2 text-center font-medium text-white"
//               >
//                 Home
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to="#"
//                 className="block rounded-lg px-4 py-2 text-center text-gray-700 transition-colors hover:bg-gray-100"
//               >
//                 Menu
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to="#"
//                 className="block rounded-lg px-4 py-2 text-center text-gray-700 transition-colors hover:bg-gray-100"
//               >
//                 Contact Us
//               </Link>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../button/Button";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 right-0 z-50 w-full">
      <div className="mx-auto max-w-7xl px-4 py-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <img
                src="/logo.svg"
                alt="Abuja Spot & Bar Logo"
                className="h-10 w-auto sm:h-12 md:h-16 lg:h-20"
              />
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden items-center md:flex">
            <div className="rounded-full bg-white px-5 py-3 shadow-md">
              <ul className="flex items-center space-x-1">
                <li>
                  <Link
                    to="/"
                    className="rounded-full bg-orange-400 px-6 py-2 font-medium text-white transition-colors hover:bg-orange-500"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/menu"
                    className="px-6 py-2 text-gray-700 transition-colors hover:text-gray-900"
                  >
                    Menu
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="px-6 py-2 text-gray-700 transition-colors hover:text-gray-900"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </nav>

          {/* CTA */}
          <div className="hidden md:flex">
            <Link to="/order">
              <Button size="lg">Order Now</Button>
            </Link>
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
          <div className="animate-slide-in-down mt-4 rounded-lg bg-white p-4 shadow-lg md:hidden">
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg bg-orange-400 px-4 py-2 text-center font-medium text-white"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/menu"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-4 py-2 text-center text-gray-700 transition-colors hover:bg-gray-100"
                >
                  Menu
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-4 py-2 text-center text-gray-700 transition-colors hover:bg-gray-100"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/order"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg bg-orange-400 px-4 py-2 text-center font-medium text-white"
                >
                  Order Now
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
