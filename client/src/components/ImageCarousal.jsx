import { useState, useEffect } from "react";

const ImageCarousal = ({ realEstateImages }) => {
  const [currentImageIndex, setCurrentImage] = useState(0);

  // loop the images in the array for continuous slider
  useEffect(() => {
    const lastIndex = realEstateImages?.length - 1;
    if (currentImageIndex < 0) {
      setCurrentImage(lastIndex);
    }
    if (currentImageIndex > lastIndex) {
      setCurrentImage(0);
    }
  }, [currentImageIndex, realEstateImages]);

  // automatic slider
  useEffect(() => {
    let slider = setInterval(() => {
      setCurrentImage(currentImageIndex + 1);
    }, 5000);
    return () => {
      clearInterval(slider);
    };
  }, [currentImageIndex]);

  return (
    <section className="relative overflow-hidden rounded-md shadow-lg h-72 md:h-96">
      {realEstateImages?.map((image, imageIndex) => {
        // default position and opacity of the image
        let position = "opacity-0 translate-x-full";

        // if the current image matches the image index
        if (imageIndex === currentImageIndex) {
          position = "opacity-1 translate-x-0";
        }
        if (
          // if the current image is the last one and the next one is the first one
          imageIndex === currentImageIndex - 1 ||
          (currentImageIndex === 0 &&
            imageIndex === realEstateImages?.length - 1)
        ) {
          position = "opacity-0 -translate-x-full";
        }
        return (
          <article
            key={imageIndex}
            className={`${position} absolute w-full h-72 md:h-96 overflow-hidden rounded-md duration-700 ease-in-out`}
          >
            <img
              src={image}
              className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 h-72 md:h-96 object-cover"
              alt="real estate"
            />
          </article>
        );
      })}
      <button
        onClick={() => setCurrentImage(currentImageIndex - 1)}
        type="button"
        className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50">
          <svg
            aria-hidden="true"
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
        </span>
      </button>
      <button
        onClick={() => setCurrentImage(currentImageIndex + 1)}
        type="button"
        className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50">
          <svg
            aria-hidden="true"
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </span>
      </button>
    </section>
  );
};

export default ImageCarousal;
