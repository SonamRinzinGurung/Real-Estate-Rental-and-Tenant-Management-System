import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { Button, CardActionArea } from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { format } from "../utils/valueFormatter";
const RealEstateCard = ({
  title,
  slug,
  price,
  category,
  address,
  realEstateImages,
  propertyOwner,
  fromOwnerUser,
  fromUserProfile,
}) => {
  return (
    <>
      <Card
        sx={{
          minWidth: 345,
          maxWidth: 345,
          bgcolor: "transparent",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 2px 5px 0 rgba(0,0,0,0.2)",
          },
          color: "#102a43",
        }}
      >
        <CardActionArea
          href={
            fromOwnerUser
              ? `/owner/real-estate/${slug}`
              : `/tenant/real-estate/${slug}`
          }
        >
          <CardMedia
            component="img"
            sx={{ maxHeight: 150 }}
            image={realEstateImages[0]}
            alt={title}
          />
          <CardContent>
            <h4
              className="mb-1 overflow-hidden overflow-ellipsis whitespace-nowrap hover:text-primaryDark transition-all duration-300 ease-in-out"
              style={{ maxWidth: "31ch" }}
            >
              {title}
            </h4>
            <p className="text-sm text-gray-400">{category}</p>
            <p className="font-semibold">
              NPR. <span className="">{format(price)}</span> / month
            </p>
            <p className="text-base">
              <LocationOnOutlinedIcon color="secondary" /> {address?.location},{" "}
              {address?.streetName}
            </p>
          </CardContent>
        </CardActionArea>

        {/*  render the contact bar only if the user is not the owner of the property */}
        {!fromOwnerUser && !fromUserProfile && (
          <div className="flex p-2">
            <div className="flex items-center gap-1">
              <img
                className="w-6 h-6 rounded-full ml-1 object-cover"
                src={propertyOwner?.profileImage}
                alt="Rounded avatar"
              />
              <span className="font-semibold text-xs text-gray-600">
                {propertyOwner?.firstName} {propertyOwner?.lastName}
              </span>
            </div>
            <Button
              href={`/tenant/owner-user/${propertyOwner?.slug}`}
              size="small"
              color="tertiary"
              variant="outlined"
              sx={{
                color: "#0496b4",
                marginLeft: "auto",
                marginRight: "0.25rem",
              }}
            >
              More Details
            </Button>
          </div>
        )}
      </Card>
    </>
  );
};

export default RealEstateCard;
