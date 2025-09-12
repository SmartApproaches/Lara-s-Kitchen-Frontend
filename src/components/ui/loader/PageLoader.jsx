import React from "react";

import logo from "/logo.svg";

export default function PageLoader() {
  return (
    <div className="bg-slate-100 bg-opacity-0 backdrop-blur-xl flex justify-center items-center h-screen w-screen">
      <img src={logo} alt="logo" className="w-40 h-fit animate-pulse" />
    </div>
  );
}
