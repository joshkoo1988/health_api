import { fetchAllPatients } from './api';

(async () => {
  console.log(" Fetching patients...");
  try {
    const patients = await fetchAllPatients();
    console.log(` Fetched ${patients.length} patients`);

    // Optional: print the first 1–2 patients for inspection
    console.log(" Sample:", patients.slice(0, 2));
  } catch (err) {
    console.error(" Failed to fetch patients:", err);
  }
})();
