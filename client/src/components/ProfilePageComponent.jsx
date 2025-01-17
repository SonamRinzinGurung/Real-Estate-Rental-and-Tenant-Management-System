import { useCallback, useState } from "react";
import {
    UserProfileComponent,
} from ".";
import ImageViewer from "react-simple-image-viewer";

const ProfilePageComponent = ({ user, handleSubmit, isProcessing }) => {

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
    return (
        <main className="flex flex-col gap-10 mt-10 px-12">
            <div className="flex flex-col gap-2">
                <h3 className="font-heading font-bold">Profile</h3>
                <p className="text-gray-400 -mt-3 font-robotoNormal">
                    View or update profile
                </p>
            </div>
            <div className="flex flex-col gap-10">
                <div className="flex flex-col md:flex-row items-center gap-6 border p-4">
                    <div className="w-40 rounded-full overflow-hidden cursor-pointer">
                        <img
                            className="h-40 w-full object-cover"
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
                                    zIndex: 9999,
                                }}
                                closeOnClickOutside={true}

                            />
                        )}
                    </div>
                    <div>

                        <p className="font-roboto text-2xl font-medium">{user?.firstName} {user?.lastName}</p>
                        <p className="">{user?.address}, {user?.city}, {user?.country}</p>
                    </div>
                </div>
                <div className="">
                    <form id="form" onSubmit={handleSubmit}>
                        <UserProfileComponent {...user} isProcessing={isProcessing} />
                    </form>
                </div>
            </div>
        </main>
    )
}

export default ProfilePageComponent