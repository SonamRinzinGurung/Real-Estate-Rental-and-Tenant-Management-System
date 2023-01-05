import { useSelector } from "react-redux";
const Homepage = () => {
  const { isLoading } = useSelector((store) => store.realEstateTenant);

  if (isLoading) return <h1>Loading...</h1>;
  return (
    <>
      <main></main>
    </>
  );
};

export default Homepage;
