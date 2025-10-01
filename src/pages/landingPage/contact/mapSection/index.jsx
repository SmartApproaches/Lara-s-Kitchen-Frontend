import React from "react";

const MapSection = () => {
  return (
    <div style={{ width: "100%", height: "500px" }}>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2293.923387696114!2d-1.3773173!3d54.9042669!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487e668bfdea7975%3A0xf612bdda7bad8ee3!2s11-12%20Tavistock%20Pl%2C%20Hendon%2C%20Sunderland%20SR1%201PB%2C%20UK!5e0!3m2!1sen!2sng!4v1759341892614!5m2!1sen!2sng"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

export default MapSection;
