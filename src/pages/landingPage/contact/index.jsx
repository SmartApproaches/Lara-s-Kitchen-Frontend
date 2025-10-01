import React from "react";
import { Footer, Header } from "../../../components";
// import Footer from "../landing/footer";
import InquiryForm from "./inquiryForm";
import MapSection from "./mapSection";

const ContactUs = () => {
  return (
    <div>
      <Header />
      <InquiryForm />
      <MapSection />
      <Footer />
    </div>
  );
};

export default ContactUs;
