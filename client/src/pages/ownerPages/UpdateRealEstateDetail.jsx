import { useCallback, useEffect } from "react";
import { AlertToast, PageLoading, UpdatePropertyForm } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  clearAlert,
  updateRealEstateDetail,
  getRealEstateDetail,
} from "../../features/realEstateOwner/realEstateOwnerSlice";
import postRealEstateImg from "../../assets/images/postRealEstateImg.svg";
import postRealEstateImg2 from "../../assets/images/postRealEstateImg2.svg";
import postRealEstateImg3 from "../../assets/images/postRealEstateImg3.svg";

const UpdateRealEstateDetail = () => {
  const {
    alertFlag,
    alertMsg,
    alertType,
    isLoading,
    realEstate,
    postSuccess,
    isProcessing,
  } = useSelector((store) => store.realEstateOwner);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { slug } = useParams();

  useEffect(() => {
    dispatch(getRealEstateDetail({ slug }));
  }, [slug, dispatch]);

  // Redirect to real estate detail page of the property after successful update
  useEffect(() => {
    if (postSuccess) {
      const timer = setTimeout(() => {
        navigate(`/owner/real-estate/${realEstate?.slug}`);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [postSuccess, navigate, realEstate?.slug]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = document.getElementById("form");
    const formData = new FormData(form);
    const formValues = Object.fromEntries(formData.entries());

    dispatch(updateRealEstateDetail({ slug, formValues }));
  };

  const handleClose = useCallback(
    (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      dispatch(clearAlert());
    },
    [dispatch]
  );

  if (isLoading) return <PageLoading />;

  return (
    <div>
      <main className="px-6 h-full mt-7">
        <div className="flex lg:justify-between justify-center flex-wrap h-full g-6">
          <div className="lg:w-5/12 md:w-8/12 mb-12">
            <form onSubmit={handleSubmit} id="form">
              <div className="flex justify-center items-center flex-col mt-3 mb-4">
                <h3 className="font-heading font-bold">
                  Update Property Details
                </h3>
                <p className="text-gray-400 text-sm">
                  Enter the updated details of your property
                </p>
              </div>
              <UpdatePropertyForm {...realEstate} isProcessing={isProcessing} />
            </form>
          </div>
          <div className="hidden grow-0 shrink-1 md:shrink-0 basis-auto w-5/12 mb-12 lg:block">
            <img
              src={postRealEstateImg}
              className="w-full"
              alt="Cartoon of a person holding a card"
            />
            <img
              src={postRealEstateImg2}
              className="w-full"
              alt="Cartoon of a person holding a card"
            />
            <img
              src={postRealEstateImg3}
              className="w-full"
              alt="Cartoon of a person holding a card"
            />
          </div>
        </div>
      </main>

      <AlertToast
        alertFlag={alertFlag}
        alertMsg={alertMsg}
        alertType={alertType}
        handleClose={handleClose}
      />
    </div>
  );
};

export default UpdateRealEstateDetail;
