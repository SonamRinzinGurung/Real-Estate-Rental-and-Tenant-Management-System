import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Button,
} from "@mui/material";
import { format, dateFormatter } from "../utils/valueFormatter";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

const RentDetailComponent = ({
  _id,
  owner,
  tenant,
  realEstate,
  paymentPlan,
  startDate,
}) => {
  const navigate = useNavigate();
  return (
    <Card
      sx={{
        width: 345,
        bgcolor: "transparent",
        boxShadow: "none",
        "&:hover": {
          boxShadow: "0 2px 5px 0 rgba(0,0,0,0.2)",
        },
        color: "#102a43",
      }}
    >
      <CardActionArea
        onClick={useCallback(() => {
          navigate(`/owner/rentDetail/${_id}`);
        }, [navigate, _id])}
      >
        <CardMedia
          component="img"
          sx={{ maxHeight: 150 }}
          image={realEstate?.realEstateImages[0]}
          alt={realEstate?.title}
        />
        <CardContent>
          <h4
            className="mb-1 overflow-hidden overflow-ellipsis whitespace-nowrap"
            style={{ maxWidth: "31ch" }}
          >
            {realEstate?.title}
          </h4>
          <p className="text-sm text-gray-400">{realEstate?.category}</p>

          <div>
            <p className="font-semibold">
              NPR. <span className="">{format(realEstate?.price)}</span> / month
            </p>
            <p className="">
              <LocationOnOutlinedIcon color="secondary" />{" "}
              {realEstate?.address?.location}, {realEstate?.address?.streetName}
            </p>
          </div>
          <div className="mt-2">
            <p className="font-robotoNormal">
              <span className="font-medium">Start Date:</span>{" "}
              {dateFormatter(startDate)}
            </p>
            <p className="font-robotoNormal">
              <span className="font-medium">Payment Plan:</span> {paymentPlan}
            </p>
          </div>
        </CardContent>
      </CardActionArea>

      <div className="flex p-2">
        <div className="flex items-center gap-1">
          <span className="text-gray-600 text-sm mr-2">Tenant</span>

          <img
            className="w-6 h-6 rounded-full ml-1 object-cover"
            src={tenant?.profileImage}
            alt="Rounded avatar"
          />
          <span className="font-semibold text-xs text-gray-600">
            {tenant?.firstName} {tenant?.lastName}
          </span>
        </div>
        <Button
          onClick={() => navigate(`/owner/tenant-user/${tenant?.slug}`)}
          size="small"
          color="tertiary"
          variant="outlined"
          sx={{
            color: "#0496b4",
            marginLeft: "auto",
            marginRight: "0.25rem",
          }}
        >
          Tenant Details
        </Button>
      </div>
    </Card>
  );
};

export default RentDetailComponent;
