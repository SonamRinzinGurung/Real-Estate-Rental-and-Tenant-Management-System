import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getProfileDetails,
  clearAlert,
  updateTenantProfile,
} from "../../features/tenantUser/tenantUserSlice";
import {
  PageLoading,
  ProfilePageComponent,
} from "../../components";
import useToast from "../../hooks/useToast";

const ProfilePageTenant = () => {
  const dispatch = useDispatch();
  const { user, isLoading, alertFlag, alertType, alertMsg, isProcessing } =
    useSelector((store) => store.tenantUser);

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

    dispatch(updateTenantProfile({ formValues }));
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

export default ProfilePageTenant;
