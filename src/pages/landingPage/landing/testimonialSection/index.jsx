import React, { useRef } from "react";
import { Carousel } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { IMAGES } from "../../../../constants";

const testimonials = [
  {
    id: 1,
    name: "Ola O.",
    location: "Spain",
    image: IMAGES.Testimonial1,
    text: "I have always wanted to experience authentic Nigerian food and visiting Lara’s Kitchen during my stay in the UK, was the highlight of my trip. The lounge had such a warm vibe, and the pounded yam with egusi was amazing.",
  },
  {
    id: 2,
    name: "John D.",
    location: "USA",
    image: IMAGES.Testimonial3,
    text: "The atmosphere was amazing and the food took me back home. I’ll definitely visit again!",
  },
  {
    id: 3,
    name: "Aisha K.",
    location: "Nigeria",
    image: IMAGES.Testimonial2,
    text: "Lara’s Kitchen is a culinary gem! The jollof rice is to die for, and the ambiance is so inviting.",
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
                  <div className="relative h-[260px] w-[260px]">
                    {/* Green background blob */}
                    <svg viewBox="0 0 200 200" className="absolute top-4 -left-4 h-full w-full">
                      <path
                        fill="#DCFCE7"
                        d="M45.5,-58.8C58.4,-52.4,67.7,-39,71.3,-24.1C74.9,-9.1,72.7,7.4,64.5,20.5C56.3,33.6,42.1,43.3,27.1,49.9C12.1,56.4,-3.7,59.8,-19.1,56.2C-34.4,52.5,-49.3,41.9,-58.7,27.7C-68.1,13.6,-72,-4.1,-67.8,-20C-63.7,-36,-51.5,-50.2,-36,-56.8C-20.6,-63.4,-2,-62.3,12.8,-61.1C27.5,-59.8,41.1,-58.2,45.5,-58.8Z"
                        transform="translate(100 100)"
                      />
                    </svg>

                    {/* Image clipped perfectly inside blob */}
                    <svg viewBox="0 0 200 200" className="relative z-10 h-full w-full">
                      <defs>
                        <clipPath id={`blobClip-${t.id}`}>
                          <path
                            d="M45.5,-58.8C58.4,-52.4,67.7,-39,71.3,-24.1C74.9,-9.1,72.7,7.4,64.5,20.5C56.3,33.6,42.1,43.3,27.1,49.9C12.1,56.4,-3.7,59.8,-19.1,56.2C-34.4,52.5,-49.3,41.9,-58.7,27.7C-68.1,13.6,-72,-4.1,-67.8,-20C-63.7,-36,-51.5,-50.2,-36,-56.8C-20.6,-63.4,-2,-62.3,12.8,-61.1C27.5,-59.8,41.1,-58.2,45.5,-58.8Z"
                            transform="translate(100 100)"
                          />
                        </clipPath>
                      </defs>

                      <image
                        href={t.image}
                        width="120%"
                        height="120%"
                        x="-10%"
                        y="8%"
                        preserveAspectRatio="xMidYMid slice"
                        clipPath={`url(#blobClip-${t.id})`}
                      />
                    </svg>
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
