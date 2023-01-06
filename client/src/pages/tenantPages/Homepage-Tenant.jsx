import { useState } from "react";
import { useSelector } from "react-redux";

const Homepage = () => {
  const [currentImageIndex, setCurrentImage] = useState(0);

  const { isLoading } = useSelector((store) => store.realEstateTenant);

  if (isLoading) return <h1>Loading...</h1>;
  return (
    <>
      <main></main>
    </>
  );
};

export default Homepage;
