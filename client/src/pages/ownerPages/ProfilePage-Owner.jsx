import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getProfileDetails,
  clearAlert,
  updateProfile,
} from "../../features/ownerUser/ownerUserSlice";
import {
  PageLoading,
  ProfilePageComponent
} from "../../components";
import useToast from "../../hooks/useToast";

const ProfilePageOwner = () => {
  const dispatch = useDispatch();
  const { user, isLoading, alertFlag, alertType, alertMsg, isProcessing } =
    useSelector((store) => store.ownerUser);

  useToast({
    alertFlag,
    alertType,
    message: alertMsg,
    clearAlertAction: clearAlert,
  });

  useEffect(() => {
    dispatch(getProfileDetails());
  }, [dispatch]);

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
    </>
  );
};

export default ProfilePageOwner;
