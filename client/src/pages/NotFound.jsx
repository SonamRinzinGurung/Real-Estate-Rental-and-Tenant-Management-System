import pageNotFoundImg from "../assets/images/Page-Not-Found.svg";
import { Button } from "@mui/material";
import { useSelector } from "react-redux";

const NotFound = () => {
  const { userType } = useSelector((store) => store.auth);
  return (
    <main className="min-h-screen">
      <div className="flex flex-col items-center justify-center min-h-screen">
        <img
          src={pageNotFoundImg}
          alt="Page Not Found"
          className="w-1/2 max-h-96"
        />
        <h3>Sorry, Page Not Found</h3>
        <p>The page you are looking for does not exists</p>
        <Button
          href={`/#/${userType || ""}`}
          sx={{
            fontSize: "1rem",
            color: "secondary.main",
            fontWeight: "bold",
          }}
          variant="text"
        >
          Go Home
        </Button>
      </div>
    </main>
  );
};

export default NotFound;
