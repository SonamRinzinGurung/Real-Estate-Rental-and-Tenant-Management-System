import { useEffect, useCallback, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    getLeaseWithRealEstateID,
    clearAlert,
    approveLease,
} from "../../features/tenantUser/tenantUserSlice";
import { useDispatch, useSelector } from "react-redux";
import { PageLoading, ConfirmModal, FormTextField, PhoneNumberField } from "../../components";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
import { createNumberFormatter, dateFormatter, format } from "../../utils/valueFormatter";
import { Button, CircularProgress, Box, TextField } from "@mui/material";
import { countries } from "../../utils/countryList";
import countryToCurrency from "country-to-currency";
import useToast from "../../hooks/useToast";
import axiosFetch from "../../utils/axiosCreate";

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
    } = useSelector((state) => state.tenantUser);

    // preview photoId
    const [photoId, setPhotoId] = useState(null);
    const handlePhotoIdChange = (e) => {
        setPhotoId(URL.createObjectURL(e.target.files[0]));
    };

    const previewImage = () => {
        if (photoId) {
            return (
                <div className="p-2">
                    <img src={photoId} alt="photoIdPreview" className="h-24 md:h-28" />
                </div>
            );
        }
    };

    useToast({
        alertFlag,
        alertType,
        message: alertMsg,
        clearAlertAction: clearAlert,
    });

    const handleChange = useCallback(
        (e) => {
            setFormValues({ ...values, [e.target.name]: e.target.value });
        },
        [values]
    );

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(values)
        const form = document.getElementById("form");
        const formData = new FormData(form);

        // update formdata to use phonenumber from state
        formData.set("phoneNumber", values.phoneNumber);
        formData.set(
            "emergencyContactPhoneNumber",
            values.emergencyContact.phoneNumber
        );

        const payload = Object.fromEntries(formData.entries());
        console.log(payload)
        const { data } = await axiosFetch.patch(`/lease/tenant/updateLeaseForm/${leaseDetail._id}`, formData);
        console.log(data);
    };

    const currentCountry = countries.find(
        (country) => country.label === leaseDetail?.realEstate?.address?.country
    );
    const format = createNumberFormatter(currentCountry?.code);

    //modal
    const [open, setOpen] = useState(false);
    const handleModalOpen = useCallback(() => setOpen(true), []);
    const handleModalClose = useCallback(() => setOpen(false), []);
    const [checked, setChecked] = useState(false);
    const [digitalSignature, setDigitalSignature] = useState("");

    const handleApproveLease = useCallback(() => {
        if (!checked) {
            alert("You must agree to the terms and conditions to proceed.");
            return;
        } else if (digitalSignature.trim() === "") {
            alert("Please provide your digital signature to proceed.");
            return;
        }
        const leaseSignTime = new Date().toISOString();
        dispatch(approveLease({ leaseId: leaseDetail._id, digitalSignature, leaseSignTime }));
        handleModalClose();
    }, [dispatch, leaseDetail, handleModalClose, checked, digitalSignature]);

    if (isLoading) return <PageLoading />;

    if (!leaseDetail)
        return (
            <div className="flex justify-center items-start h-screen mt-10">
                <h1>Lease Does not Exists!</h1>
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

                    <div className="flex flex-col justify-center my-2">
                        <label
                            htmlFor="photoId"
                            className="mb-2 cursor-pointer font-robotoNormal self-center"
                        >
                            Upload Photo ID
                        </label>

                        <input
                            required
                            name="photoId"
                            className="font-robotoNormal w-full px-3 py-1.5 text-base font-normal border border-solid border-gray-300 rounded cursor-pointer focus:border-primary focus:outline-none"
                            type="file"
                            id="photoId"
                            onChange={handlePhotoIdChange}
                        />
                        <p className="mt-1 text-sm text-gray-500">
                            JPG, JPEG, PNG or GIF (MAX 3.5mb per)
                        </p>
                        <div className="self-center border mt-2">
                            {previewImage()}
                        </div>
                    </div>

                    <div className="text-center">
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            color="primary"
                            disabled={isLoading}
                            sx={{
                                color: "white",
                                "&:hover": {
                                    backgroundColor: "primary.dark",
                                    opacity: [0.9, 0.8, 0.7],
                                },
                                width: "100%",
                            }}
                        >
                            {isLoading ? (
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
                    <h3 className="text-center">Agree to Lease?</h3>
                    <p className="text-center my-4">
                        Are you sure you want to agree to this lease? Once you agree to
                        this lease, you will not be able to cancel it. You will be
                        agreeing to the terms and conditions of this lease.
                    </p>
                    <div className="flex flex-wrap justify-center gap-8 mt-8">
                        <Button onClick={handleModalClose} color="error">
                            Close
                        </Button>

                        <Button
                            onClick={handleApproveLease}
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
