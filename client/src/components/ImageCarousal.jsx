import { useState, useCallback } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ImageViewer from "react-simple-image-viewer";

const ImageCarousal = ({ realEstateImages }) => {
  // currentImageIndex is the index of the image that is currently displayed in the ImageViewer
  const [currentImageIndex, setCurrentImage] = useState(0);

  // toggle open and close of ImageViewer
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  // open the ImageViewer and set the currentImageIndex to the index of the image that was clicked
  const openImageViewer = useCallback((index) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  // close the ImageViewer
  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  return (
    <section className="overflow-hidden rounded-md shadow-lg h-72 md:h-96">
      <Carousel autoPlay infiniteLoop useKeyboardArrows showThumbs={false}>
        {realEstateImages?.map((image, index) => (
          <div
            key={index}
            className="h-72 md:h-96 overflow-hidden cursor-pointer"
            onClick={() => openImageViewer(index)}
          >
            <img
              src={image}
              alt="Real Estate Property"
              className="h-72 md:h-96 object-cover"
            />
          </div>
        ))}
      </Carousel>

      {/* Open and View the Image */}
      {isViewerOpen && (
        <ImageViewer
          src={realEstateImages}
          currentIndex={currentImageIndex}
          onClose={closeImageViewer}
          disableScroll={false}
          backgroundStyle={{
            backgroundColor: "rgba(0,0,0,0.9)",
          }}
          closeOnClickOutside={true}
        />
      )}
    </section>
  );
};

export default ImageCarousal;
