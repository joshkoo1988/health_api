import axios from "axios";
import axiosRetry from "axios-retry";

import { HEALTH_API_KEY, WEB_API_URL } from "./constants";
import { Patient, PaginatedResponse } from "./types";

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


// Exported function that the app calls
export async function fetchAllPatients(): Promise<Patient[]> {
  const allPatients: Patient[] = [];
  let page = 1;
  let hasNext = true;

  while (hasNext) {
    try {
      const response = await axios.get<PaginatedResponse>(
        `${WEB_API_URL}/patients?page=${page}&limit=5`,
        {
          headers: {
            'x-api-key': HEALTH_API_KEY,
          },
        }
      );

      const { data, pagination } = response.data;
      allPatients.push(...data);
      hasNext = pagination.hasNext;
      page++;
    } catch (error) {
      console.error(`Failed to fetch page ${page}:`, (error as any).message);
      throw error;
    }
  }

  return allPatients;
}