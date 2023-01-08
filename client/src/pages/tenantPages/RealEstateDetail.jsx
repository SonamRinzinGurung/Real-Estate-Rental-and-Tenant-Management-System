import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSingleRealEstate } from "../../features/realEstateTenant/realEstateTenantSlice";
import { RealEstateDetailCard, PageLoading } from "../../components";
import Avatar from "@mui/material/Avatar";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import { Button, CardActionArea } from "@mui/material";
import ForwardToInboxRoundedIcon from "@mui/icons-material/ForwardToInboxRounded";
import ContactsRoundedIcon from "@mui/icons-material/ContactsRounded";

const RealEstateDetail = () => {
  const { realEstate, isLoading } = useSelector(
    (state) => state.realEstateTenant
  );
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const { id } = useParams();

  useEffect(() => {
    dispatch(getSingleRealEstate({ id }));
  }, [id, dispatch]);

  if (isLoading) return <PageLoading />;

  return (
    <main className="flex gap-2 flex-col lg:flex-row">
      <div className="flex flex-col gap-8 mt-10 mx-auto p-4 w-4/6 lg:ml-14">
        <RealEstateDetailCard {...realEstate} />

        <div className="">
          <h3 className="font-semibold p-3">Description</h3>
          <hr className="w-3/4 ml-3 border-t-2 rounded-md" />
          <p className="text-lg p-3 tracking-normal">
            {realEstate?.description}
          </p>
        </div>
        <div className="">
          <h3 className="font-semibold p-3">Overview</h3>
          <hr className="w-3/4 ml-3 border-t-2 rounded-md" />
        </div>
      </div>
      <aside className="mx-auto my-10 p-4 w-4/6 lg:w-1/3 lg:mr-14">
        <CardActionArea href={`#`}>
          <div className="shadow-lg rounded-md p-4">
            <div className="flex gap-2 items-center">
              <h4 className="font-medium">Contact Info</h4>
              <ContactsRoundedIcon color="secondary" />
            </div>
            <div className="flex mt-4 gap-2 items-center">
              <Avatar src={realEstate?.propertyOwner?.profileImage} />
              <p className="leading-4">
                {realEstate?.propertyOwner?.firstName}{" "}
                {realEstate?.propertyOwner?.lastName}
              </p>
            </div>
            <div className="flex mt-2 ml-1 gap-2 items-center">
              <LocalPhoneRoundedIcon sx={{ color: "#6D9886" }} />
              <p className="ml-3">{realEstate?.propertyOwner?.phoneNumber}</p>
            </div>
            <div className="flex mt-2 ml-1 gap-2 items-center">
              <EmailRoundedIcon sx={{ color: "#E7AB79" }} />
              <p className="">{realEstate?.propertyOwner?.email}</p>
            </div>
          </div>
        </CardActionArea>

        <div className="mt-8 shadow-lg rounded-md p-4">
          <div className="flex gap-2 items-center">
            <h4 className="font-medium">Send Email</h4>
            <ForwardToInboxRoundedIcon color="tertiary" />
          </div>
          <div className="flex mt-4 gap-2 items-center">
            <span className="font-semibold"> To: </span>
            <p className="">{realEstate?.propertyOwner?.email}</p>
          </div>
          <div className="flex mt-2 gap-2 items-center">
            <span className="font-semibold"> From: </span>
            <p className="">{user?.email}</p>
          </div>
          <div className="flex mt-2 gap-2 items-center">
            <span className="font-semibold"> Subject: </span>
            <p className="">Rental of Property</p>
          </div>
          <div className="flex mt-2 gap-2 items-start">
            <span className="font-semibold"> Body: </span>
            <p className="text-sm">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rerum
              sed consequatur consectetur praesentium cumque quam nobis illo
              quod molestias enim?
            </p>
          </div>
          <div className="flex mt-2 gap-2 justify-end py-2">
            <Button variant="contained" color="tertiary" sx={{ color: "#fff" }}>
              Send Email
            </Button>
          </div>
        </div>
      </aside>
    </main>
  );
};

export default RealEstateDetail;
