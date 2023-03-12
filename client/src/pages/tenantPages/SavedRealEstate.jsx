import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSavedRealEstate } from "../../features/realEstateTenant/realEstateTenantSlice";
import { PageLoading, RealEstateCard, Footer } from "../../components";

const SavedRealEstate = () => {
  const { allRealEstate, isLoading } = useSelector(
    (store) => store.realEstateTenant
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllSavedRealEstate());
  }, [dispatch]);

  if (isLoading) return <PageLoading />;

  if (allRealEstate?.length === 0)
    return (
      <h1 className="text-center mt-8 mb-6 font-heading">
        No Real Estate Saved
      </h1>
    );

  return (
    <>
      <main className="flex flex-col mb-12 mt-8 md:items-start md:ml-10">
        <h3 className="my-4 font-heading font-bold text-center">
          Saved Properties
        </h3>
        <div className="justify-center flex flex-wrap gap-8 mx-4 md:justify-start md:mx-0">
          {allRealEstate?.map((item) => {
            return <RealEstateCard key={item._id} {...item} />;
          })}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default SavedRealEstate;
