import { useSelector } from "react-redux";
import { PageLoading } from "../../components";
const Homepage = () => {
  const { isLoading } = useSelector((store) => store.realEstateTenant);

  if (isLoading) return <PageLoading />;
  return (
    <>
      <main></main>
    </>
  );
};

export default Homepage;
