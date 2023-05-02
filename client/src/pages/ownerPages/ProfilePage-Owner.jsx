import { useEffect, useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getProfileDetails,
  clearAlert,
  updateProfile,
} from "../../features/ownerUser/ownerUserSlice";
import {
  AlertToast,
  PageLoading,
  UserProfileComponent,
} from "../../components";
import ImageViewer from "react-simple-image-viewer";

const ProfilePage = () => {
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

  // toggle open and close of ImageViewer
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  // open the ImageViewer and set the currentImageIndex to the index of the image that was clicked
  const openImageViewer = useCallback((index) => {
    setIsViewerOpen(true);
  }, []);

  // close the ImageViewer
  const closeImageViewer = () => {
    setIsViewerOpen(false);
  };

  if (isLoading) return <PageLoading />;

  return (
    <>
      <main className="flex flex-col items-center md:flex-row md:justify-center md:mx-28">
        <div className="md:w-1/3 mt-10">
          <p className="font-bold font-heading text-2xl my-2">
            {user?.firstName} {user?.lastName}
          </p>
          <div className="w-60 rounded-lg overflow-hidden mt-4 cursor-pointer">
            <img
              className="h-60 w-full object-cover"
              src={user?.profileImage}
              alt="profile"
              onClick={() => openImageViewer(0)}
            />
            {/* Open and View the Image */}
            {isViewerOpen && (
              <ImageViewer
                src={[user?.profileImage]}
                currentIndex={0}
                onClose={closeImageViewer}
                disableScroll={false}
                backgroundStyle={{
                  backgroundColor: "rgba(0,0,0,0.9)",
                }}
                closeOnClickOutside={true}
              />
            )}
          </div>
        </div>
        <div className="w-3/4 mt-10">
          <div className="mb-4 text-center">
            <h3 className="font-heading font-bold">Profile</h3>
            <p className="text-gray-400 -mt-3 font-robotoNormal">
              View or update profile
            </p>
          </div>
          <form id="form" onSubmit={handleSubmit}>
            <UserProfileComponent {...user} isProcessing={isProcessing} />
          </form>
        </div>
      </main>
      <AlertToast
        alertFlag={alertFlag}
        alertMsg={alertMsg}
        alertType={alertType}
        handleClose={handleClose}
      />
    </>
  );
};

export default ProfilePage;
