import { dateFormatter, format } from "../utils/valueFormatter";
import { CircularProgress, Pagination } from "@mui/material";

const PaymentHistoryComponent = ({
  allPaymentHistory,
  isProcessing,
  numberOfPages,
  page,
  handlePageChange,
}) => {
  if (isProcessing)
    return (
      <div className="flex justify-center items-center mt-12">
        <CircularProgress size={"8rem"} />
      </div>
    );

  if (allPaymentHistory?.length === 0)
    return (
      <div className="mt-10">
        <h4 className="font-robotoNormal font-medium">
          No payment history found!
        </h4>
      </div>
    );

  if (allPaymentHistory?.length > 0)
    return (
      <div className="flex flex-col mt-10">
        <h4 className="mb-4 font-heading font-bold">Payment History</h4>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <div className="overflow-hidden rounded-md">
              <table className="min-w-full">
                <thead className="bg-gray-200 border-b">
                  <tr>
                    <th
                      scope="col"
                      className="text-base font-semibold px-6 py-4 text-left"
                    >
                      #
                    </th>
                    <th
                      scope="col"
                      className="text-base font-semibold px-6 py-4 text-left"
                    >
                      Rent Date
                    </th>
                    <th
                      scope="col"
                      className="text-base font-semibold px-6 py-4 text-left"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="text-base font-semibold px-6 py-4 text-left"
                    >
                      Payment Method
                    </th>
                    <th
                      scope="col"
                      className="text-base font-semibold px-6 py-4 text-left"
                    >
                      Paid On
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allPaymentHistory?.map((payment, index) => (
                    <tr
                      key={payment._id}
                      className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-xs md:text-sm font-medium">
                        {index + 1}
                      </td>
                      <td className="text-xs md:text-sm font-light px-6 py-4 whitespace-nowrap">
                        {dateFormatter(payment.currentRentDate.from)} -{" "}
                        {dateFormatter(payment.currentRentDate.to)}
                      </td>
                      <td className="text-xs md:text-sm font-light px-6 py-4 whitespace-nowrap">
                        NPR. {format(payment.amountPaid)}
                      </td>
                      <td className="text-xs md:text-sm font-light px-6 py-4 whitespace-nowrap">
                        {payment.paymentMethod}
                      </td>
                      <td className="text-xs md:text-sm font-light px-6 py-4 whitespace-nowrap">
                        {dateFormatter(payment.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <Pagination
          count={numberOfPages}
          page={page}
          onChange={handlePageChange}
          color="secondary"
          className="flex justify-center mt-4"
        />
      </div>
    );
};

export default PaymentHistoryComponent;
