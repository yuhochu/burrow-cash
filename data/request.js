const constResStatus = {
  BAD_REQUEST: 400, // Cannot process request
  NO_AUTH: 401, // Authentication required
  FORBIDDEN: 403, // Not allowed to access
  NOT_FOUND: 404, // Resources not found
  INVALID: 422, // Request validation error
  INVALID_API_USER: 420, // Token is invalid due to disabled user
  INVALID_TOKEN: 484, // Token is invalid
  INTERNAL_SERVER_ERROR: 500, // Internal Server Error
};

const constServerError = {
  [constResStatus.INVALID]: "Couldn't understand server response",
  [constResStatus.NOT_FOUND]: "Api not found",
  ERROR_SERVER_UNREACHABLE:
    "Couldn't contact the server. Please check your internet connection and try again",
};

export const parseResponse = async (response) => {
  const responseStatusNumber = Number(response?.status);
  const clientErrors = [constResStatus.NOT_FOUND];
  if (clientErrors.includes(responseStatusNumber)) {
    throw constServerError[responseStatusNumber];
  }

  let json;
  try {
    json = await response.json();
  } catch (err) {
    throw constServerError[constResStatus.INVALID];
  }
  if (json === undefined) {
    throw constServerError[constResStatus.INVALID];
  }

  // If not successful, throw JSON as response
  if (responseStatusNumber >= 400 && responseStatusNumber <= 599) {
    throw json;
  }

  return json;
};

export const URLForEndpoint = (endpoint, params, host) => {
  if (!host) {
    throw new Error("host is required");
  }
  let url = `${host}${endpoint}`;
  if (params && typeof params === "object") {
    Object.keys(params).forEach((key) => {
      if (typeof params[key] === "object") {
        params[key] = JSON.stringify(params[key]);
      }
    });
    // https://nodejs.org/dist/latest-v16.x/docs/api/url.html#class-urlsearchparams
    url += `?${new URLSearchParams(params)}`;
  }
  return url;
};
