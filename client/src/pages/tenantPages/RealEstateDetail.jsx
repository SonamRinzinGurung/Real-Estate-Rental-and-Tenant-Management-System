import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSingleRealEstate } from "../../features/realEstateTenant/realEstateTenantSlice";
import CircularProgress from "@mui/material/CircularProgress";
import { RealEstateDetailCard } from "../../components";

const RealEstateDetail = () => {
  const { realEstate, isLoading } = useSelector(
    (state) => state.realEstateTenant
  );

  const dispatch = useDispatch();

  const { id } = useParams();

  useEffect(() => {
    dispatch(getSingleRealEstate({ id }));
  }, [id, dispatch]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress size={"8rem"} />
      </div>
    );

  return (
    <main>
      <div className="flex flex-col gap-1 m-4">
        <RealEstateDetailCard {...realEstate} />
        <div className="max-w-3xl shadow-md m-4">
          <h1 className="font-semibold text-2xl p-3">Description</h1>
          <hr className="p-1 w-1/2" />
          <p className="text-sm">{realEstate?.description}</p>
        </div>
      </div>
    </main>
  );
};

export default RealEstateDetail;
