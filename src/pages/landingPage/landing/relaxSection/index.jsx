import { HugeiconsIcon } from "@hugeicons/react";
import { PlayIcon } from "@hugeicons/core-free-icons";
import React, { useRef, useState } from "react";

const RelaxSection = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    videoRef.current.play();
    setIsPlaying(true);
  };

  return (
    <div className="bg-[#FAFAFA] py-12">
      <h1 className="animate-fade-in-down text-center text-4xl font-bold text-[#B2B3B26E]">
        Relax. Eat. Connect.
      </h1>

      <div className="mx-auto mt-3 flex max-w-6xl flex-col items-center gap-10 md:flex-row">
        {/* Text */}
        <div className="flex max-w-md flex-col justify-center px-6">
          <h3 className="text-primary text-start text-3xl font-bold">Our Lounge</h3>
          <p className="text-start text-lg text-black">
            Step into our cozy lounge where good vibes meet great food.
          </p>
        </div>

        {/* Video */}
        <div className="relative mt-6 flex flex-1 justify-center">
          <div className="relative w-full max-w-3xl overflow-hidden rounded-lg border-4 border-[#0C4113] shadow-lg">
            <video
              ref={videoRef}
              src="/ourLoungeVid.mp4"
              className="w-full object-cover"
              controls={isPlaying}
              onPlay={() => setIsPlaying(true)}
            />

            {/* Big Play Button */}
            {!isPlaying && (
              <button
                onClick={handlePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/30 transition hover:bg-black/40"
              >
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-lg">
                  <HugeiconsIcon icon={PlayIcon} size={50} className="ml-2 text-[#0C4113]" />
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelaxSection;
