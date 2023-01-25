import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTenantUserDetails } from "../../features/ownerUser/ownerUserSlice";
import { useParams } from "react-router-dom";
import { Footer, PageLoading } from "../../components";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { Button } from "@mui/material";
import ContactPageRoundedIcon from "@mui/icons-material/ContactPageRounded";
import CircularProgress from "@mui/material/CircularProgress";

const TenantUserDetailPage = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();

  const { user, isLoading, isProcessing } = useSelector(
    (state) => state.ownerUser
  );

  useEffect(() => {
    dispatch(getTenantUserDetails({ slug }));
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
      <main className="mx-auto mb-12">
        <div className="flex flex-col mt-10 mb-5  items-start gap-1 ">
          <h3 className="font-heading font-semibold text-4xl">Profile</h3>
          <div className="w-48 h-48 mt-6">
            <img
              src={user?.profileImage}
              alt="profile"
              className="rounded-md w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-4 items-center mt-4">
            <p className="mt-2 text-xl font-robotoNormal">
              {user?.firstName} {user?.lastName}
            </p>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<ContactPageRoundedIcon />}
              size="small"
              sx={{
                color: "white",
              }}
            >
              {isProcessing ? (
                <CircularProgress
                  size={26}
                  sx={{
                    color: "#fff",
                  }}
                />
              ) : (
                "Add"
              )}
            </Button>
          </div>

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
      </main>
      <Footer />
    </>
  );
};

export default TenantUserDetailPage;
