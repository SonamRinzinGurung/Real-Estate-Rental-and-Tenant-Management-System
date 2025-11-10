import { useEffect, useCallback, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    getLeaseWithRealEstateID,
    clearAlert,
    updateLeaseTenantInfo
} from "../../features/tenantUser/tenantUserSlice";
import { useDispatch, useSelector } from "react-redux";
import { PageLoading, ConfirmModal, FormTextField, PhoneNumberField, ImageDropZone } from "../../components";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
import { createNumberFormatter, dateFormatter } from "../../utils/valueFormatter";
import { Button, CircularProgress } from "@mui/material";
import { countries } from "../../utils/countryList";
import countryToCurrency from "country-to-currency";
import useToast from "../../hooks/useToast";

const LeaseTenantInfoForm = () => {
    const { realEstateId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [values, setFormValues] = useState({
        fullName: "",
        phoneNumber: "",
        email: "",
        emergencyContact: {
            name: "",
            phoneNumber: "",
        },

    });

    useEffect(() => {
        dispatch(getLeaseWithRealEstateID({ realEstateId }));
    }, [dispatch, realEstateId]);

    const {
        leaseDetail,
        isLoading,
        isProcessing,
        alertFlag,
        alertType,
        alertMsg,
        success
    } = useSelector((state) => state.tenantUser);

    // preview photoId
    const [photoId, setPhotoId] = useState([]);
    const [proofOfIncome, setProofOfIncome] = useState([]);

    useToast({
        alertFlag,
        alertType,
        message: alertMsg,
        clearAlertAction: clearAlert,
    });

    useEffect(() => {
        if (success) {
            setTimeout(() => {
                navigate(`/tenant/lease/${leaseDetail?.realEstate?._id}/${leaseDetail?.realEstate?.slug}`);
            }, 1600);
        }

    }, [success, navigate, leaseDetail]);

    const handleChange = useCallback(
        (e) => {
            setFormValues(prev => ({ ...prev, [e.target.name]: e.target.value }));
        },
        []
    );

    const handleSubmit = async (e) => {
        e.preventDefault();

        setOpen(true);
    };

    const currentCountry = countries.find(
        (country) => country.label === leaseDetail?.realEstate?.address?.country
    );
    const format = createNumberFormatter(currentCountry?.code);

    //modal
    const [open, setOpen] = useState(false);
    const handleModalClose = () => {
        setOpen(false);
    };

    const handleSubmitForm = useCallback(() => {

        const form = document.getElementById("form");
        const formData = new FormData(form);

        // update formdata to use phonenumber from state
        formData.set("phoneNumber", values.phoneNumber);
        formData.set(
            "emergencyContactPhoneNumber",
            values.emergencyContact.phoneNumber
        );

        if (photoId.length < 1) {
            alert("Please upload your Photo ID.");
            return;
        }

        if (proofOfIncome.length < 1) {
            alert("Please upload your Proof of Income.");
            return;
        }

        formData.append("photoId", photoId[0]);
        for (const file of proofOfIncome) {
            formData.append("proofOfIncome", file);
        }
        dispatch(updateLeaseTenantInfo({ leaseId: leaseDetail._id, updateData: formData }));
    }, [dispatch, leaseDetail?._id, photoId, proofOfIncome, values]);

    if (isLoading) return <PageLoading />;

    if (!leaseDetail)
        return (
            <div className="flex justify-center items-start h-screen mt-10">
                <h1>Lease Does not Exists!</h1>
            </div>
        );

    if (leaseDetail.status !== "Pending")
        return (
            <div className="flex justify-center items-start h-screen mt-10">
                <h1>You have already submitted your lease information.</h1>
            </div>
        );

    return (
        <main className="flex flex-col gap-6 items-center md:items-start md:ml-10 mt-8">
            <h3 className="font-heading font-bold">
                Lease Form
            </h3>
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex flex-col gap-2 p-4 ">
                    <h5 className="font-semibold">Property Details</h5>
                    <Link
                        to={`/tenant/real-estate/${leaseDetail?.realEstate?.slug}`}
                    >
                        <h5 className="font-robotoNormal hover:text-primaryDark duration-300 ease-in-out cursor-pointer">
                            {leaseDetail?.realEstate?.title}
                        </h5>
                    </Link>
                    <p>{leaseDetail?.realEstate?.category}</p>
                    <p className="">
                        <LocationOnOutlinedIcon color="success" />{" "}
                        {leaseDetail?.realEstate?.address.streetName},{" "}
                        {leaseDetail?.realEstate?.address?.city},{" "}
                        {leaseDetail?.realEstate?.address?.state},{" "}
                        {leaseDetail?.realEstate?.address?.country}
                    </p>
                </div>

                <div className="flex flex-col gap-2 p-4">
                    <h5 className="font-semibold">Property Owner</h5>
                    <Link to={`/tenant/owner-user/${leaseDetail?.owner?.slug}`}>
                        <h5 className="font-robotoNormal hover:text-primaryDark duration-300 ease-in-out cursor-pointer">
                            {leaseDetail?.owner?.firstName}{" "}
                            {leaseDetail?.owner?.lastName}
                        </h5>
                    </Link>
                    <div className="flex gap-2 items-center">
                        <LocalPhoneRoundedIcon sx={{ color: "#6D9886" }} />
                        <p className="">{leaseDetail?.owner?.phoneNumber}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                        <EmailRoundedIcon sx={{ color: "#E7AB79" }} />
                        <p className="lowercase overflow-clip">
                            {leaseDetail?.owner?.email}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-2 p-4">
                    <h5 className="font-semibold">Lease Details</h5>
                    <div>
                        <h5 className="font-robotoNormal">
                            <span className="font-medium">Lease Start Date</span>:{" "}
                            {dateFormatter(leaseDetail?.startDate)}
                        </h5>
                    </div>
                    <div>
                        <h5 className="font-robotoNormal">
                            <span className="font-medium">Payment Plan</span>:{" "}
                            {leaseDetail?.paymentPlan}
                        </h5>
                    </div>
                    <div>
                        <h5 className="font-robotoNormal">
                            <span className="font-medium">Rent Amount</span>: {countryToCurrency[currentCountry.code]}{" "}
                            {format(leaseDetail?.realEstate?.price)} per month
                        </h5>
                    </div>
                </div>
            </div>
            <form onSubmit={handleSubmit} id="form" className="w-1/2">
                <div className="flex flex-col w-full gap-6 ">
                    <div className="flex justify-center w-full">
                        <h4 className="text-center"> Provide Your Information </h4>
                    </div>
                    <div className="flex flex-col gap-4 justify-center w-full">
                        <FormTextField
                            label="Full Name"
                            name="fullName"
                            type={"text"}
                            value={values.fullName}
                            handleChange={handleChange}
                            autoFocus={true}
                        />
                        <PhoneNumberField
                            value={values.phoneNumber}
                            name="phoneNumber"
                            handleChange={
                                (fullPhone) => {
                                    setFormValues({
                                        ...values,
                                        phoneNumber: fullPhone,
                                    });
                                }
                            }
                        />

                        <FormTextField
                            label="Email"
                            name="email"
                            type={"email"}
                            value={values.email}
                            handleChange={handleChange}
                        />
                        <div className="">
                            <h5 className="mb-2">Emergency Contact Information</h5>
                            <div className="flex flex-col gap-2">

                                <FormTextField
                                    label="Name"
                                    name="emergencyContactName"
                                    type={"text"}
                                    value={values.emergencyContact.name}
                                    handleChange={(e) => {
                                        setFormValues({
                                            ...values,
                                            emergencyContact: {
                                                ...values.emergencyContact,
                                                name: e.target.value,
                                            },
                                        });
                                    }}
                                />
                                <PhoneNumberField
                                    value={values.emergencyContact.phoneNumber}
                                    name="emergencyContactPhoneNumber"
                                    handleChange={
                                        (fullPhone) => {
                                            setFormValues({
                                                ...values,
                                                emergencyContact: {
                                                    ...values.emergencyContact,
                                                    phoneNumber: fullPhone,
                                                },
                                            });
                                        }
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <ImageDropZone fileState={photoId} setFileState={setPhotoId} label="Photo ID" />

                    <ImageDropZone fileState={proofOfIncome} setFileState={setProofOfIncome} label="Proof of Income" maxFiles={3} />
                    <div className="text-center">
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            color="primary"
                            disabled={isProcessing}
                            sx={{
                                color: "white",
                                "&:hover": {
                                    backgroundColor: "primary.dark",
                                    opacity: [0.9, 0.8, 0.7],
                                },
                                width: "100%",
                            }}
                        >
                            {isProcessing ? (
                                <CircularProgress
                                    size={26}
                                    sx={{
                                        color: "#fff",
                                    }}
                                />
                            ) : (
                                "Submit"
                            )}
                        </Button>

                    </div>
                </div>
            </form>

            <div>
                <ConfirmModal open={open} handleModalClose={handleModalClose}>
                    <h3 className="text-center">Confirm Provided Information</h3>
                    <p className="text-center my-4">
                        Are you sure you want to confirm the provided information? Once you confirm, you will not be able to make changes. Make sure all the information is accurate before proceeding.
                    </p>
                    <div className="flex flex-wrap justify-center gap-8 mt-8">
                        <Button onClick={handleModalClose} color="error">
                            Close
                        </Button>

                        <Button
                            onClick={handleSubmitForm}
                            color="success"
                            variant="contained"
                        >
                            Confirm
                        </Button>
                    </div>
                </ConfirmModal>
            </div>
        </main>
    );
};

export default LeaseTenantInfoForm;
