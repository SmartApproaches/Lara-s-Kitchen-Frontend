import React from "react";
import { Footer, Header } from "../../../components";
import MenuHero from "./meuHero";
import AvailableDishes from "./availableDishes";
// import Footer from "../landing/footer";
import ContactUs from "../contact";

const LandingMenu = () => {
  return (
    <div>
      <Header />
      <MenuHero />
      <AvailableDishes />
      <Footer />
    </div>
  );
};

export default LandingMenu;
