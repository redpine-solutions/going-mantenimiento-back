import CustomError from "../custom/customError";

const throwErrorBase = (error: CustomError) => {
  if (error.builtError) {
    throw error;
  }

  // Bad use of function if it reaches this point
  throw new Error("Error must be a built error object");
};

export default throwErrorBase;
