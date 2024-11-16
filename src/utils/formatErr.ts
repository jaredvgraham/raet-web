export const formatError = (error: any) => {
  console.log("error from formatError", error);

  return error.toString().split(":")[1];
};
