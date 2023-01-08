import CircularProgress from "@mui/material/CircularProgress";

const PageLoading = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <CircularProgress size={"8rem"} />
    </div>
  );
};

export default PageLoading;
