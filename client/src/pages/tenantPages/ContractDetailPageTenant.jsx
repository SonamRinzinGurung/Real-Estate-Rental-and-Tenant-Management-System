import { useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getContractWithRealEstateID } from "../../features/tenantUser/tenantUserSlice";
import { PageLoading } from "../../components";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
import { dateFormatter, format } from "../../utils/valueFormatter";

const ContractDetailPageTenant = () => {
  const dispatch = useDispatch();
  const { realEstateId } = useParams();

  useEffect(() => {
    dispatch(getContractWithRealEstateID({ realEstateId }));
  }, [dispatch, realEstateId]);

  const { contractDetail, isLoading } = useSelector(
    (state) => state.tenantUser
  );

  // calculate the total rent amount according to payment plan
  const calculateTotalRent = useCallback(() => {
    const { paymentPlan, rentAmount } = contractDetail;
    if (paymentPlan === "Monthly") return rentAmount;
    if (paymentPlan === "Every 2 Months") return rentAmount * 2;
    if (paymentPlan === "Every 3 Months") return rentAmount * 3;
    if (paymentPlan === "Every 6 Months") return rentAmount * 6;
    if (paymentPlan === "Every 12 Months") return rentAmount * 12;
  }, [contractDetail]);

  if (isLoading) return <PageLoading />;

  if (!contractDetail)
    return (
      <div className="flex justify-center items-start h-screen mt-10">
        <h1>Contract Does not Exists!</h1>
      </div>
    );

  return (
    <main className="mb-12 mt-4">
      <h3 className="my-4 font-heading font-bold text-center">
        Contract Detail
      </h3>
      <div className="flex flex-col w-11/12 mx-auto items-center gap-4 sm:flex-row sm:justify-center sm:items-start">
        <div className="flex flex-col gap-2 w-3/5  p-4 items-center text-center">
          <h4 className="font-bold">Real Estate</h4>
          <Link to={`/tenant/real-estate/${contractDetail?.realEstate?.slug}`}>
            <h5 className="font-robotoNormal hover:text-primaryDark duration-300 ease-in-out cursor-pointer">
              {contractDetail?.realEstate?.title}
            </h5>
          </Link>
          <p>{contractDetail?.realEstate?.category}</p>
          <p className="">
            <LocationOnOutlinedIcon color="success" />{" "}
            {contractDetail?.realEstate?.address.location},{" "}
            {contractDetail?.realEstate?.address?.streetName}
          </p>
        </div>

        <div className="flex flex-col gap-2 w-3/5  p-4 items-center text-center">
          <h4 className="font-bold">Property Owner</h4>
          <Link to={`/tenant/owner-user/${contractDetail?.owner?.slug}`}>
            <h5 className="font-robotoNormal hover:text-primaryDark duration-300 ease-in-out cursor-pointer">
              {contractDetail?.owner?.firstName}{" "}
              {contractDetail?.owner?.lastName}
            </h5>
          </Link>
          <div className="flex gap-2 items-center">
            <LocalPhoneRoundedIcon sx={{ color: "#6D9886" }} />
            <p className="">{contractDetail?.owner?.phoneNumber}</p>
          </div>
          <div className="flex gap-2 items-center">
            <EmailRoundedIcon sx={{ color: "#E7AB79" }} />
            <p className="lowercase overflow-clip">
              {contractDetail?.owner?.email}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 items-center mt-4 text-center">
        <h4 className="font-bold">Contract Details</h4>
        <div>
          <h5 className="font-robotoNormal">
            <span className="font-medium">Contract Start Date</span>:{" "}
            {dateFormatter(contractDetail?.startDate)}
          </h5>
        </div>
        <div>
          <h5 className="font-robotoNormal">
            <span className="font-medium">Payment Plan</span>:{" "}
            {contractDetail?.paymentPlan}
          </h5>
        </div>
        <div>
          <h5 className="font-robotoNormal">
            <span className="font-medium">Rent Amount</span>: NRS.{" "}
            {format(contractDetail?.rentAmount)} per month
          </h5>
        </div>
      </div>
      <div className="w-11/12 mx-auto text-justify mt-6">
        <h4>Rental Agreement Contract</h4>
        <p>
          This Rental Agreement Contract is applicable from{" "}
          <strong>{dateFormatter(contractDetail?.startDate)}</strong>, created
          by the property owner{" "}
          <strong>
            {contractDetail?.owner?.firstName} {contractDetail?.owner?.lastName}
          </strong>
          , for the rental of the property located at{" "}
          <strong>
            {contractDetail?.realEstate?.address?.location},{" "}
            {contractDetail?.realEstate?.address?.streetName}
          </strong>{" "}
          with the tenant{" "}
          <strong>
            {contractDetail?.tenant?.firstName}{" "}
            {contractDetail?.tenant?.lastName}
          </strong>
          .
        </p>
        <br />
        <h5>1. Payment of Rent</h5>
        <p>
          Tenant shall pay rent in the amount of{" "}
          <strong>NPR {format(contractDetail?.rentAmount)}</strong> per month.
          Total Rent amount of{" "}
          <strong>NPR {format(calculateTotalRent())}</strong> shall be due and
          payable every <strong>{contractDetail?.paymentPlan}</strong> on the
          first day of the calendar month and shall be considered late if not
          received by the Landlord on or before the 7th day of the month.
        </p>
        <br />
        <h5>2. Late Fees</h5>
        <p>
          If rent is not received by the 7th day of the month, a late fee of 5%
          shall be added to the total amount due.
        </p>
        <br />
        <h5>3. Termination of Agreement</h5>
        <p>
          The Landlord may terminate this Agreement if rent is more than 30 days
          late. In such event, Tenant shall vacate the Property immediately.
        </p>
        <br />
        <h5>4. Entire Agreement</h5>
        <p>
          This Agreement constitutes the entire agreement between the parties
          and supersedes all prior negotiations, understandings, and agreements
          between the parties, whether written or oral.
        </p>
        <br />
        <h5>5. Amendments</h5>
        <p>
          This Agreement may only be amended by written instrument executed by
          both parties.
        </p>
        <br />
        <h5>6. Governing Law</h5>
        <p>
          This Agreement shall be governed by and construed in accordance with
          the laws of the state in which the Property is located.
        </p>
        <br />
        <h5>7. Assignment and Binding Effect</h5>
        <p>
          Tenant shall not assign this Agreement or sublease the Property
          without the prior written consent of the Landlord. This Agreement
          shall be binding upon and inure to the benefit of both parties, their
          heirs, legal representatives, successors, and assigns.
        </p>
        <br />
      </div>
      <div className="flex justify-center mt-6"></div>
    </main>
  );
};

export default ContractDetailPageTenant;
