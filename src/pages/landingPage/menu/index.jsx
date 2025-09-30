import React from "react";
import { Header } from "../../../components";
import MenuHero from "./meuHero";
import AvailableDishes from "./availableDishes";
import Footer from "../landing/footer";

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
