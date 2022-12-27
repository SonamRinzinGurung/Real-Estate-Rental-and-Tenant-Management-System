import emailValidator from "deep-email-validator";

//validates email while user registration to avoid use of fake email that are not in use

export const isEmailValid = async (email) => {
  return emailValidator.validate(email);
};
