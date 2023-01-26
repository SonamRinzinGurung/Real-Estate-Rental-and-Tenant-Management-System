import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { Card, CardContent, CardMedia, CardActionArea } from "@mui/material";

const ContactsCard = ({
  firstName,
  lastName,
  address,
  profileImage,
  email,
  slug,
}) => {
  const navigate = useNavigate();
  return (
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
        onClick={useCallback(() => {
          navigate(`/owner/tenant-user/${slug}`);
        }, [navigate, slug])}
      >
        <CardMedia
          component="img"
          sx={{ maxHeight: 280 }}
          image={profileImage}
          alt={firstName}
        />
        <CardContent>
          <h4
            className="mb-1 hover:text-primaryDark transition-all duration-300 ease-in-out"
            style={{ maxWidth: "31ch" }}
          >
            {firstName} {lastName}
          </h4>
          <p className="text-sm">
            <EmailRoundedIcon color="secondary" /> {email}
          </p>

          <p className="text-base text-gray-500">
            <LocationOnOutlinedIcon sx={{ color: "#019149" }} /> {address}
          </p>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ContactsCard;
