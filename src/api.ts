import axios from "axios";
import axiosRetry from "axios-retry";

import { HEALTH_API_KEY, WEB_API_URL } from "./constants";
import { PaginationInfo, Patient } from "./types";

// Setup axios with retries
axiosRetry(axios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    const status = error?.response?.status;
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      (typeof status === 'number' && [429, 500, 503].includes(status))
    );
  }
});
