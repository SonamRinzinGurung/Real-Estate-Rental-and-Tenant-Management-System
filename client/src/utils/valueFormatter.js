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
