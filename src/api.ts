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

// delay timer for api call
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


// Exported function that the app calls
export async function fetchAllPatients(): Promise<Patient[]> {
  const allPatients: Patient[] = [];
  let page = 1;
  let hasNext = true;

while (hasNext) {
  try {
    console.log(`Fetching page ${page}...`);
    const response = await axios.get(
      `${WEB_API_URL}/patients?page=${page}&limit=5`,
      {
        headers: { 'x-api-key': HEALTH_API_KEY },
        timeout: 10000,
      }
    );

    const result = response.data;

    if (!result || !Array.isArray(result.data) || !result.pagination) {
      console.warn(`Malformed response on page ${page}. Retrying after 20s...`);
      await sleep(20000);
      continue; //try the same page again
    }

    const { data, pagination } = result;
    allPatients.push(...data);
    hasNext = pagination.hasNext;
    page++;

    console.log(`Page ${page - 1} fetched (${data.length} patients). Waiting 20s...`);
    await sleep(20000);
  } catch (error) {
    console.error(`Failed to fetch page ${page}:`, (error as any).message);
    throw error;
  }
}


  return allPatients;
}