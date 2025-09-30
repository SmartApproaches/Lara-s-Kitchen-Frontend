import React from "react";
import HerSection from "./hero";
import { Header } from "../../../components";
import CravingNigeriaFood from "./cravingNigeriaSection";
import MostPopularDishes from "./mostPopularDishes";
import WhatSetsUsApart from "./whatSetUsApart";
import RelaxSection from "./relaxSection";
import UpcomingEventSection from "./upcomingEvents";
import TestimonialSection from "./testimonialSection";
import Footer from "./footer";

const LandingPage = () => {
  return (
    <div>
      {/* Header fixed near top */}
      <div className="">
        <Header />
      </div>

      {/* Hero section */}
      <HerSection />
      <CravingNigeriaFood />
      <MostPopularDishes />
      <WhatSetsUsApart />
      <RelaxSection />
      <UpcomingEventSection />
      <TestimonialSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
