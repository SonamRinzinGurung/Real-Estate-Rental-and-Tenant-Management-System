import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Button,
  Avatar,
} from "@mui/material";
import { format, dateFormatter } from "../utils/valueFormatter";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

const RentDetailComponent = ({
  _id,
  tenant,
  realEstate,
  paymentPlan,
  startDate,
}) => {
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
      <Link to={`/owner/rentDetail/${_id}`}>
        <CardActionArea>
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
                NPR. <span className="">{format(realEstate?.price)}</span> /
                month
              </p>
              <p className="">
                <LocationOnOutlinedIcon color="secondary" />{" "}
                {realEstate?.address?.location},{" "}
                {realEstate?.address?.streetName}
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
      </Link>
      <div className="flex p-2">
        <div className="flex items-center gap-1">
          <span className="text-gray-600 text-sm mr-2">Tenant</span>
          <Avatar
            src={tenant?.profileImage}
            alt={tenant?.firstName}
            sx={{ width: 36, height: 36 }}
          />
          <span className="font-semibold text-xs text-gray-600">
            {tenant?.firstName} {tenant?.lastName}
          </span>
        </div>
        <Link className="ml-auto" to={`/owner/tenant-user/${tenant?.slug}`}>
          <Button
            size="small"
            color="tertiary"
            variant="outlined"
            sx={{
              color: "#0496b4",
            }}
          >
            Tenant Details
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default RentDetailComponent;
