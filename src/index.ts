import { fetchAllPatients } from './api';
import { scorePatientRisk } from './riskScorer';
import { submitAssessment } from './submit';

(async () => {
  console.log("Fetching patients...");
  try {
    const patients = await fetchAllPatients();
    console.log(`Fetched ${patients.length} patients`);

    const high_risk_patients: string[] = [];
    const fever_patients: string[] = [];
    const data_quality_issues: string[] = [];

    // Score each patient
    for (const patient of patients) {
      const result = scorePatientRisk(patient);

      if (result.totalScore >= 4 && !result.hasDataQualityIssue) {
        high_risk_patients.push(result.patient_id);
        console.log("\n[High Risk]", result.patient_id, patient);
      }

      if (result.hasFever) {
        fever_patients.push(result.patient_id);
        console.log("\n[Fever]", result.patient_id, patient);
      }

      if (result.hasDataQualityIssue) {
        data_quality_issues.push(result.patient_id);
        console.log("\n[Data Quality Issue]", result.patient_id, patient);
      }
    }

    // Output the lists
    console.log('\nSummary Results');
    console.log('High Risk Patients:', high_risk_patients);
    console.log('Fever Patients:', fever_patients);
    console.log('Data Quality Issues:', data_quality_issues);

    // Submit for grading (uncomment when ready)

    await submitAssessment({
      high_risk_patients,
      fever_patients,
      data_quality_issues,
    });

  } catch (err) {
    console.error("Failed to fetch patients:", err);
  }
})();
