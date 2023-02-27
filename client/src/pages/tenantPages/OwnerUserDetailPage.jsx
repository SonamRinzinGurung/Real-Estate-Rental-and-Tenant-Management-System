import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOwnerUserDetails } from "../../features/tenantUser/tenantUserSlice";
import { useParams } from "react-router-dom";
import { RealEstateCard, Footer, PageLoading } from "../../components";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

const OwnerUserDetailPage = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();

  const { user, realEstates, isLoading } = useSelector(
    (state) => state.tenantUser
  );

  useEffect(() => {
    dispatch(getOwnerUserDetails({ slug }));
  }, [dispatch, slug]);

  if (isLoading) return <PageLoading />;

  if (!user)
    return (
      <div className="flex justify-center items-start h-screen mt-10">
        <h1>User Not found</h1>
      </div>
    );

  return (
    <>
      <main className="flex flex-col md:flex-row gap-8 md:items-start">
        <div className="flex flex-col mt-10 mb-5 md:mb-12 md:w-1/4 items-center gap-1 md:ml-10">
          <h3 className="font-heading font-semibold text-4xl">Profile</h3>
          <div className="w-48 h-48 mt-6">
            <img
              src={user?.profileImage}
              alt="profile"
              className="rounded-full w-full h-full object-cover"
            />
          </div>
          <p className="mt-2 text-lg">
            {user?.firstName} {user?.lastName}
          </p>

          <div className="flex mt-2 gap-2 items-center">
            <LocationOnOutlinedIcon sx={{ color: "#019149" }} />
            <p>{user?.address}</p>
          </div>
          <div className="flex mt-2 gap-2 items-center">
            <LocalPhoneRoundedIcon sx={{ color: "#6D9886" }} />
            <p className="ml-3">+977 {user?.phoneNumber}</p>
          </div>
          <div className="flex mt-2 gap-2 items-center">
            <EmailRoundedIcon sx={{ color: "#E7AB79" }} />
            <p className="">{user?.email}</p>
          </div>
        </div>
        <div className="mb-12 md:w-3/4 md:mt-10">
          {realEstates?.length === 0 ? (
            <div>
              <h4 className="text-center">No Real Estate Properties</h4>
            </div>
          ) : (
            <>
              <h3 className="text-center font-heading font-semibold text-4xl">
                {realEstates?.length > 1 ? "Properties" : "Property"}
              </h3>
              <div className="justify-center flex flex-wrap gap-8 mt-6 mx-4 md:mx-0">
                {realEstates?.map((item) => {
                  return (
                    <RealEstateCard key={item._id} {...item} fromUserProfile />
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default OwnerUserDetailPage;
