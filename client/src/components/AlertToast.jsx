import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
const AlertToast = ({ alertFlag, alertMsg, alertType, handleClose }) => {
  const vertical = "bottom";
  const horizontal = "left";

  return (
    <Snackbar
      open={alertFlag}
      anchorOrigin={{ vertical, horizontal }}
      autoHideDuration={4000}
      onClose={handleClose}
    >
      <Alert severity={alertType || "success"} sx={{ width: "250px" }}>
        {alertMsg || ""}
      </Alert>
    </Snackbar>
  );
};

export default AlertToast;
