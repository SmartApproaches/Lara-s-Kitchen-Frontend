import React from "react";
import { IMAGES, ICONS } from "../../../../constants";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative h-4/5 overflow-hidden bg-white">
      {/* Polygon background should cover most of the footer */}
      <div className="absolute top-0 -right-12 h-full w-[55%]">
        <img
          src={IMAGES.footerPolygon}
          alt="Decorative Polygon"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="absolute top-0 -right-12 h-full w-[55%]">
        <img
          src={IMAGES.footterTransperant}
          alt="footterTransperant"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="relative z-10 grid max-w-3xl grid-cols-1 gap-5 px-6 py-12 md:grid-cols-4">
        {/* Logo */}
        <div className="flex items-start justify-center md:justify-start">
          <img src={IMAGES.logo} alt="Abula Spot & Bar" className="w-40 object-contain" />
        </div>

        {/* Useful Links */}
        <div>
          <h4 className="mb-4 text-lg font-bold text-[#00072F]">Useful Links</h4>
          <ul className="space-y-2 text-gray-700">
            <li>
              <a
                href="#"
                className="block border-b border-[#EFEFEF] pb-1 hover:border-green-700 hover:text-green-700"
              >
                Menu
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block border-b border-[#EFEFEF] pb-1 hover:border-green-700 hover:text-green-700"
              >
                Contact us
              </a>
            </li>
          </ul>
        </div>

        {/* Get in Touch */}
        <div>
          <h4 className="mb-4 text-lg font-bold text-[#00072F]">Get In Touch</h4>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-center gap-3">
              <img src={ICONS.locationIcon} alt="Location" />
              <span>11-12 Tavistock place Sr11pb</span>
            </li>
            <li className="flex items-center gap-3">
              <img src={ICONS.callIcon} alt="Phone" />
              <span>07454822494</span>
            </li>
            <li className="flex items-center gap-3">
              <img src={ICONS.mailIcon} alt="Email" />
              <span>admin@laraskitchen.org</span>
            </li>
          </ul>

          {/* Social icons */}
          <div className="mt-6 flex gap-4">
            <a
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-green-700"
            >
              <img src={ICONS.facebookIcon} alt="Facebook" />
            </a>
            <a
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-green-700"
            >
              <img src={ICONS.instagramIcon} alt="Instagram" />
            </a>
            <a
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-green-700"
            >
              <img src={ICONS.xIcon} alt="Twitter" />
            </a>
          </div>
        </div>
      </div>
      {/* Phones + store badges */}
      <div className="absolute top-0 right-0 flex flex-col items-center gap-6">
        <div className="">
          <img src={IMAGES.phones} alt="App phone" className="w-md object-contain" />
        </div>
        <div className="-mt-8">
          <img src={IMAGES.PlayStoreApple} alt="PlayStoreApple" className="w-48" />
        </div>
      </div>

      {/* Bottom text aligned left */}
      <div className="relative z-10 px-6 py-4">
        <p className="text-left text-sm text-gray-600">
          App and Website Developed by Smart Approaches
        </p>
      </div>
    </footer>
  );
};

export default Footer;
