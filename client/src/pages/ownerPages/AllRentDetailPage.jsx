import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const AllRentDetailPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Button
        variant="contained"
        onClick={() => navigate("/owner/rentDetail/create")}
      >
        Create Rent Detail
      </Button>
    </div>
  );
};

export default AllRentDetailPage;
