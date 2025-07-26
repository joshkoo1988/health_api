import { fetchAllPatients } from './api';
import { scorePatientRisk, PatientRiskResult } from './riskScorer';

(async () => {
  console.log("⏳ Fetching patients...");
  try {
    const patients = await fetchAllPatients();
    console.log(` Fetched ${patients.length} patients`);

    const high_risk_patients: string[] = [];
    const fever_patients: string[] = [];
    const data_quality_issues: string[] = [];

    // Score each patient
    for (const patient of patients) {
      const result = scorePatientRisk(patient);

      if (result.totalScore >= 4) {
        high_risk_patients.push(result.patient_id);
      }

      if (result.hasFever) {
        fever_patients.push(result.patient_id);
      }

      if (result.hasDataQualityIssue) {
        data_quality_issues.push(result.patient_id);
      }
    }

    //  Output the lists
    console.log('\n Summary Results');
    console.log('High Risk Patients:', high_risk_patients);
    console.log('Fever Patients:', fever_patients);
    console.log('Data Quality Issues:', data_quality_issues);

  } catch (err) {
    console.error(" Failed to fetch patients:", err);
  }
})();
