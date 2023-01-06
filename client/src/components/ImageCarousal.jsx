import { useState, useEffect } from "react";

const ImageCarousal = ({ realEstateImages }) => {
  const [currentImageIndex, setCurrentImage] = useState(0);

  useEffect(() => {
    const lastIndex = realEstateImages?.length - 1;
    if (currentImageIndex < 0) {
      setCurrentImage(lastIndex);
    }
    if (currentImageIndex > lastIndex) {
      setCurrentImage(0);
    }
  }, [currentImageIndex, realEstateImages]);

  useEffect(() => {
    let slider = setInterval(() => {
      setCurrentImage(currentImageIndex + 1);
    }, 5000);
    return () => {
      clearInterval(slider);
    };
  }, [currentImageIndex]);

  return (
    <section className="relative overflow-hidden">
      {realEstateImages?.map((image, imageIndex) => {
        let position = "hidden";
        if (imageIndex === currentImageIndex) {
          position = "block";
        }

        return (
          <article
            key={imageIndex}
            className={`${position} relative h-72 md:h-96 overflow-hidden rounded-md duration-700 ease-in-out`}
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
