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

  if (allRealEstate?.length === 0) return <h1>No Real Estate Saved</h1>;

  return (
    <>
      <main className="mt-7 ml-14">
        <h2 className="mb-4">Saved Properties</h2>
        <div className="flex flex-wrap gap-8 mb-12">
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
