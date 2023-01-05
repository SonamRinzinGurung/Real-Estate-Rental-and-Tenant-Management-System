import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { Button, CardActionArea, CardActions } from "@mui/material";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
const RealEstateCard = ({
  title,
  description,
  price,
  category,
  address,
  area,
  realEstateImages,
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
        <CardActionArea href="#">
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
              NPR. <span className="">{price}</span> / month
            </p>
            <p className="text-base">
              <LocationOnOutlinedIcon color="secondary" /> {address?.location},{" "}
              {address?.streetName}
            </p>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button
            href="#"
            size="small"
            color="tertiary"
            variant="outlined"
            sx={{ color: "#0496b4" }}
          >
            More Details
          </Button>
        </CardActions>
      </Card>
    </>
  );
};

export default RealEstateCard;
