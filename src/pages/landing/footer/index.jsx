import React from "react";
import { IMAGES } from "../../../constants";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-white">
      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-12 md:grid-cols-2 lg:grid-cols-4">
        {/* Logo */}
        <div className="flex items-start justify-center md:justify-start">
          <img src={IMAGES.logo} alt="Abula Spot & Bar" className="w-40 object-contain" />
        </div>

        {/* Useful Links */}
        <div>
          <h4 className="mb-4 text-lg font-semibold">Useful Links</h4>
          <ul className="space-y-2 text-gray-700">
            <li>
              <a href="#" className="hover:text-green-700">
                Menu
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-green-700">
                Contact us
              </a>
            </li>
          </ul>
        </div>

        {/* Get in Touch */}
        <div>
          <h4 className="mb-4 text-lg font-semibold">Get In Touch</h4>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-center gap-3">
              {/* <FaMapMarkerAlt className="text-green-700" /> */}
              <span>11-12 Tavistock place Sr11pb</span>
            </li>
            <li className="flex items-center gap-3">
              {/* <FaPhone className="text-green-700" /> */}
              <span>07454822494</span>
            </li>
            <li className="flex items-center gap-3">
              {/* <FaEnvelope className="text-green-700" /> */}
              <span>admin@laraskitchen.org</span>
            </li>
          </ul>

          {/* Social icons */}
          <div className="mt-6 flex gap-4">
            <a
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-green-700 text-white"
            >
              {/* <FaFacebookF /> */}
            </a>
            <a
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-green-700 text-white"
            >
              {/* <FaInstagram /> */}
            </a>
            <a
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-green-700 text-white"
            >
              {/* <FaXTwitter /> */}
            </a>
          </div>
        </div>

        {/* Phones + store badges */}
        <div className="relative">
          <div className="absolute inset-0 -right-6 rounded-tl-[100px] rounded-bl-[100px] bg-green-900"></div>
          <div className="relative z-10 flex flex-col items-center gap-6">
            <div className="flex gap-4">
              <img
                src="/phone1.png" // replace with phone mockup image
                alt="App phone 1"
                className="h-64 object-contain"
              />
              <img
                src="/phone2.png" // replace with phone mockup image
                alt="App phone 2"
                className="h-64 object-contain"
              />
            </div>
            <div className="flex gap-4">
              <img
                src="/googleplay.png" // replace with Play Store badge
                alt="Google Play"
                className="h-12"
              />
              <img
                src="/appstore.png" // replace with App Store badge
                alt="App Store"
                className="h-12"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom text */}
      <div className="border-t border-gray-200 py-4 text-center text-sm text-gray-600">
        App and Website Developed by Smart Approaches
      </div>
    </footer>
  );
};

export default Footer;
