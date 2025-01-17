import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getProfileDetails,
  clearAlert,
  updateProfile,
} from "../../features/ownerUser/ownerUserSlice";
import {
  AlertToast,
  PageLoading,
  ProfilePageComponent
} from "../../components";
const ProfilePageOwner = () => {
  const dispatch = useDispatch();
  const { user, isLoading, alertFlag, alertType, alertMsg, isProcessing } =
    useSelector((store) => store.ownerUser);

  useEffect(() => {
    dispatch(getProfileDetails());
  }, [dispatch]);

  const handleClose = useCallback(
    (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      dispatch(clearAlert());
    },
    [dispatch]
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = document.getElementById("form");
    const formData = new FormData(form);

    const formValues = Object.fromEntries(formData.entries());

    dispatch(updateProfile({ formValues }));
  };


  if (isLoading) return <PageLoading />;

  return (
    <>
      <ProfilePageComponent
        user={user}
        handleSubmit={handleSubmit}
        isProcessing={isProcessing}
      />
      <AlertToast
        alertFlag={alertFlag}
        alertMsg={alertMsg}
        alertType={alertType}
        handleClose={handleClose}
      />
    </>
  );
};

export default ProfilePageOwner;
