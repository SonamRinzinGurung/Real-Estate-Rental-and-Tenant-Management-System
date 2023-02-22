import moment from "moment";

export const { format } = new Intl.NumberFormat("en-IN", {
  style: "decimal",
});

export const dateFormatter = (date) => {
  return moment(date).format("MMM Do, YYYY");
};

export const ageCalculator = (date) => {
  return moment().diff(date, "years");
};

// calculate the total rent amount according to payment plan
export const calculateTotalRent = (paymentPlan, price) => {
  if (paymentPlan === "Monthly") return price;
  if (paymentPlan === "Every 2 Months") return price * 2;
  if (paymentPlan === "Every 3 Months") return price * 3;
  if (paymentPlan === "Every 6 Months") return price * 6;
  if (paymentPlan === "Every 12 Months") return price * 12;
};

// calculate number of months according to payment plan
export const calculateNumberOfMonths = (paymentPlan) => {
  if (paymentPlan === "Monthly") return "1 month";
  if (paymentPlan === "Every 2 Months") return "2 months";
  if (paymentPlan === "Every 3 Months") return "3 months";
  if (paymentPlan === "Every 6 Months") return "6 months";
  if (paymentPlan === "Every 12 Months") return "12 months";
};

// calculate the added date according to payment plan
export const calculateAddedDate = (paymentPlan, currentRentDate) => {
  if (paymentPlan === "Monthly")
    return moment(currentRentDate)
      .add(0, "months")
      .endOf("month")
      .endOf("month")
      .format("YYYY-MM-DD");
  if (paymentPlan === "Every 2 Months")
    return moment(currentRentDate)
      .add(1, "months")
      .endOf("month")
      .format("YYYY-MM-DD");
  if (paymentPlan === "Every 3 Months")
    return moment(currentRentDate)
      .add(2, "months")
      .endOf("month")
      .format("YYYY-MM-DD");
  if (paymentPlan === "Every 6 Months")
    return moment(currentRentDate)
      .add(5, "months")
      .endOf("month")
      .format("YYYY-MM-DD");
  if (paymentPlan === "Every 12 Months")
    return moment(currentRentDate)
      .add(11, "months")
      .endOf("month")
      .format("YYYY-MM-DD");
};

// calculate the next due date according to last payment date
export const calculateNextDueDate = (lastPaymentDate) => {
  return moment(lastPaymentDate).add(1, "d").format("YYYY-MM-DD");
};
