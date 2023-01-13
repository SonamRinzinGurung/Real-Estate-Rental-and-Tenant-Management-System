import { useState, useEffect } from "react";
import { getAllRealEstate } from "../../features/realEstateTenant/realEstateTenantSlice";
import { useDispatch, useSelector } from "react-redux";
import { PageLoading, RealEstateCard, Footer } from "../../components";
import Pagination from "@mui/material/Pagination";

const AllRealEstate = () => {
  const { allRealEstate, isLoading, numberOfPages } = useSelector(
    (store) => store.realEstateTenant
  );

  const dispatch = useDispatch();
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(getAllRealEstate({ page }));
  }, [dispatch, page]);

  const handleChange = (event, value) => {
    setPage(value);
  };
  if (isLoading) return <PageLoading />;

  if (allRealEstate?.length === 0) return <h1>No Real Estate Found</h1>;

  return (
    <>
      <div className="mt-8">
        <h3 className="text-center m-4 font-heading font-bold">
          All Properties
        </h3>
        <main className="flex flex-wrap gap-5 justify-center mb-12">
          {allRealEstate?.map((item) => {
            return <RealEstateCard key={item._id} {...item} />;
          })}
        </main>
      </div>
      <Pagination
        count={numberOfPages}
        page={page}
        onChange={handleChange}
        color="secondary"
        className="flex justify-center mb-12"
      />

      <Footer />
    </>
  );
};

export default AllRealEstate;
