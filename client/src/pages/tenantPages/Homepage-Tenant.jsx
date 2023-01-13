import { useEffect } from "react";
import { getAllRealEstate } from "../../features/realEstateTenant/realEstateTenantSlice";
import { useDispatch, useSelector } from "react-redux";
import { PageLoading, RealEstateCard, Footer } from "../../components";

const Homepage = () => {
  const { allRealEstate, isLoading } = useSelector(
    (store) => store.realEstateTenant
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllRealEstate());
  }, [dispatch]);

  if (isLoading) return <PageLoading />;

  if (allRealEstate?.length === 0) return <h1>No Real Estate Found</h1>;

  return (
    <>
      <div className="mt-8">
        <h3 className="text-center m-4 font-heading font-bold">
          All Properties
        </h3>
        <main className="flex flex-wrap gap-5 justify-center mb-12 md:justify-center">
          {allRealEstate?.map((item) => {
            return <RealEstateCard key={item._id} {...item} />;
          })}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Homepage;
