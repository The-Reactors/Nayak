const URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_BASE_URL
    : process.env.REACT_APP_BASE_URL_DEV;
export default URL;
