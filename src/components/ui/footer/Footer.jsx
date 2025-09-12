import React from "react";
import {
  Menu01Icon,
  Mail01Icon,
  Call02Icon,
  Location01Icon,
  InstagramIcon,
  NewTwitterIcon,
  AppleIcon,
  Facebook01Icon,
  GoogleIcon,
} from "hugeicons-react";

const Footer = () => {
  return (
    <footer className="relative bg-white overflow-hidden">
      {/* <div className="absolute right-0 top-0 bottom-0 w-1/2">
        <img
          src="/path-to-green-bg.png"
          alt="Green background"
          className="w-full h-full object-cover"
        />
      </div> */}

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="flex justify-center lg:justify-start">
            <img
              src="/logo.svg"
              alt="Abuja Spot & Bar Logo"
              className="h-20 md:h-36 w-auto"
            />
          </div>

          <div className="text-center lg:text-left">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Useful Links
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="flex items-center justify-center lg:justify-start text-gray-600 hover:text-primary transition-colors"
                >
                  Menu
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center justify-center lg:justify-start text-gray-600 hover:text-primary transition-colors"
                >
                  Contact us
                </a>
              </li>
            </ul>
          </div>

          <div className="text-center lg:text-left">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Get In Touch
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-center lg:justify-start text-gray-600">
                <Location01Icon size={18} className="mr-2 flex-shrink-0" />
                <span>
                  11- 12 Tavistock place
                  <br />
                  Sr1tpb
                </span>
              </div>
              <div className="flex items-center justify-center lg:justify-start text-gray-600">
                <Call02Icon size={18} className="mr-2" />
                <span>07454822494</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start text-gray-600">
                <Mail01Icon size={18} className="mr-2" />
                <span>admin@lareskitchen.org</span>
              </div>
            </div>

            <div className="flex justify-center lg:justify-start space-x-3 mt-6">
              <a
                href="#"
                className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-green-800 transition-colors"
              >
                <Facebook01Icon size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-green-800 transition-colors"
              >
                <InstagramIcon size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-green-800 transition-colors"
              >
                <NewTwitterIcon size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* <div className="mt-12 flex flex-col lg:flex-row items-center justify-between">
          <div className="flex space-x-4 mb-6 lg:mb-0">
            <img
              src="/mobile-app-screenshot-1.png"
              alt="Mobile App Screenshot 1"
              className="h-48 w-auto rounded-lg shadow-lg"
            />
            <img
              src="/mobile-app-screenshot-2.png"
              alt="Mobile App Screenshot 2"
              className="h-48 w-auto rounded-lg shadow-lg"
            />
          </div>

          <div className="flex flex-row space-y-3 lg:space-y-4">
            <a
              href="#"
              className="flex items-center bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <GoogleIcon size={24} className="mr-3" />
              <div>
                <div className="text-xs">GET IT ON</div>
                <div className="text-sm font-semibold">Google Play</div>
              </div>
            </a>
            <a
              href="#"
              className="flex items-center bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <AppleIcon size={24} className="mr-3" />
              <div>
                <div className="text-xs">Download on the</div>
                <div className="text-sm font-semibold">App Store</div>
              </div>
            </a>
          </div>
        </div> */}

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-base text-gray-600">
            App and Website Developed by Smart Approaches
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
