import React, { useRef } from "react";
import { Carousel, Avatar } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { IMAGES } from "../../../../constants";

const testimonials = [
  {
    id: 1,
    name: "Maria L.",
    location: "Spain",
    image: IMAGES.testimonialImage,
    text: "I have always wanted to experience authentic Nigerian food and visiting Lara’s Kitchen during my stay in the UK, was the highlight of my trip. The lounge had such a warm vibe, and the pounded yam with egusi was amazing.",
  },
  {
    id: 2,
    name: "John D.",
    location: "USA",
    image: IMAGES.testimonialImage,
    text: "The atmosphere was amazing and the food took me back home. I’ll definitely visit again!",
  },
];

const TestimonialSection = () => {
  const carouselRef = useRef(null);

  return (
    <section className="bg-[#F7F7F7] py-16">
      <div className="relative mx-auto max-w-5xl px-6">
        {/* Title */}
        <h2 className="text-center text-[3.5rem] font-bold text-[#B2B3B26E]">Testimonials</h2>

        {/* Carousel */}
        <div className="relative mt-10">
          <Carousel ref={carouselRef} dots={false} autoplay>
            {testimonials.map((t) => (
              <div key={t.id}>
                <div className="flex flex-col items-center gap-10 px-4 md:flex-row md:px-12">
                  {/* Avatar with blob */}
                  <div className="relative flex-shrink-0">
                    <div
                      className="absolute top-6 -left-6 -z-10 rounded-[45%]"
                      style={{
                        width: 180,
                        height: 180,
                        transform: "rotate(12deg)",
                      }}
                    />
                    <Avatar size={260} src={t.image} alt={t.name} className="object-cover" />
                  </div>

                  {/* Text */}
                  <div className="flex-1 text-center md:text-left">
                    <p className="text-lg leading-relaxed font-bold text-[#222222]">“{t.text}”</p>
                    <p className="mt-6 font-bold text-[#222222]">
                      – {t.name}, {t.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>

          {/* Single right arrow */}
          <button
            onClick={() => carouselRef.current.next()}
            className="absolute top-1/2 right-4 flex h-12 w-12 -translate-y-1/2 items-center justify-center bg-transparent focus:outline-none"
          >
            <RightOutlined className="text-2xl text-black" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
