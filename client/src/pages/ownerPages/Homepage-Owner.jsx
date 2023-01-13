import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPersonalRealEstate } from "../../features/realEstateOwner/realEstateOwnerSlice";
import { Footer, PageLoading, RealEstateCard } from "../../components";
import { Button } from "@mui/material";

const Homepage = () => {
  const dispatch = useDispatch();

  const { allRealEstate, isLoading } = useSelector(
    (store) => store.realEstateOwner
  );
  useEffect(() => {
    dispatch(getPersonalRealEstate());
  }, [dispatch]);

  if (isLoading) return <PageLoading />;

  return (
    <>
      <main className="flex flex-col mb-12 mt-8 md:items-start md:ml-10">
        {allRealEstate?.length === 0 ? (
          <>
            <div>
              <h4 className="mb-4">You have not posted any properties</h4>
              <Button
                href="/owner/property/post"
                variant="contained"
                sx={{ color: "#fff" }}
              >
                Post Property
              </Button>
            </div>
          </>
        ) : (
          <>
            <h3 className="my-4 font-heading font-bold text-center">
              Your {allRealEstate?.length > 1 ? "Properties" : "Property"}
            </h3>
            <div className="flex flex-wrap gap-8 justify-center">
              {allRealEstate?.map((item) => {
                return (
                  <RealEstateCard key={item._id} {...item} fromOwnerUser />
                );
              })}
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  );
};

export default Homepage;
