import { useEffect } from "react";
import { getAllRealEstate } from "../../features/realEstateTenant/realEstateTenantSlice";
import { useDispatch, useSelector } from "react-redux";
import { RealEstateCard } from "../../components";
import CircularProgress from "@mui/material/CircularProgress";

const AllRealEstate = () => {
  const { realEstate, isLoading } = useSelector(
    (store) => store.realEstateTenant
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllRealEstate());
  }, [dispatch]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress size={"8rem"} />
      </div>
    );

  if (realEstate?.length === 0) return <h1>No Real Estate Found</h1>;

  return (
    <>
      <h2 className="text-center m-4">All Properties</h2>
      <main className="flex flex-wrap gap-5 justify-center md:justify-center">
        {realEstate?.map((item) => {
          return <RealEstateCard key={item._id} {...item} />;
        })}
      </main>
    </>
  );
};

export default AllRealEstate;
