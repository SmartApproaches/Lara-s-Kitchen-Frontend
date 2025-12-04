import { IMAGES } from "../../../../constants";

const HerSection = () => {
  return (
    <div className="mx-auto h-fit w-full overflow-hidden md:min-h-screen md:bg-[#DBFFE6]">
      <div className="relative mx-auto h-[32rem] max-w-[100rem] md:min-h-screen 2xl:max-w-full">
        {/* Top left splash */}
        <div className="animate-slide-in-left absolute top-0 left-0">
          <img
            src={IMAGES.landingSplash}
            alt="landing splash"
            className="w-28 sm:w-36 md:w-52 lg:w-64"
          />
        </div>

        {/* Bottom right watermelon */}
        <div className="animate-slide-in-right absolute right-0 bottom-0 2xl:right-0">
          <img
            src={IMAGES.watermelonbg}
            alt="watermelon"
            className="w-72 md:w-80 lg:w-[28rem] xl:w-2xl 2xl:w-7xl"
          />
        </div>

        {/* Woman eating */}
        <div className="animate-zoom-in absolute right-6 bottom-0 sm:right-12">
          <img
            src={IMAGES.womanLandingPage}
            alt="woman eating"
            className="w-72 md:w-80 lg:w-[28rem] xl:w-2xl 2xl:w-7xl"
          />
        </div>

        {/* Hero heading */}
        <div className="animate-fade-in-up absolute top-1/4 left-6 md:left-20 md:max-w-xl 2xl:max-w-6xl">
          <h2 className="text-primary max-w-[20rem] text-2xl leading-snug font-bold md:max-w-[50rem] md:text-5xl 2xl:text-[4rem]">
            A True Taste of Nigeria,
            <span className="text-[#FFC107]"> Just for You</span>
          </h2>

          <p className="mt-2 max-w-[40rem] text-sm text-[#0C4113] md:text-xl 2xl:mt-10 2xl:text-4xl">
            We bring you the most delicious Nigerian dishes, served fresh in our restaurant or
            delivered straight to the comfort of your home.
          </p>
        </div>

        {/* Cloud */}
        <div className="animate-slide-in-bottom absolute right-0 -bottom-16 left-0 md:-bottom-44 2xl:-bottom-60">
          <img src={IMAGES.cloudimge} alt="cloud" className="w-full" />
        </div>
      </div>
    </div>
  );
};

export default HerSection;
