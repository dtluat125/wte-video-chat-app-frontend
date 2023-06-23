export const API_BASE_URL = "http://13.127.104.36:3001/api/v1";
export const BASE_URL = "http://13.127.104.36:3001";
export const HttpStatus = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  ITEM_NOT_FOUND: 444,
  ITEM_ALREADY_EXIST: 445,
  ITEM_INVALID: 446,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
  NETWORK_ERROR: 502,
};

export const Regex = {
  PHONE_NUMBER_FORMAT: /^(\d{4})(\d{3})(\d{3})$/,
  EMAIL:
    /^(([a-zA-Z0-9]+)([.]{1})?)*[a-zA-Z0-9]@([a-zA-Z0-9]+[.])+[a-zA-Z0-9]+$/,
};

export const PageRoute = {
  HOME_PAGE: "/",
  LOGIN_PAGE: "/login",
  SIGNUP_PAGE: "/signup",
  CHAT_PAGE: "/chat",
};
