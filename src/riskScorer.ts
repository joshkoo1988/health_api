import { Patient } from './types';

export interface PatientRiskResult {
  patient_id: string;
  totalScore: number;
  hasFever: boolean;
  hasDataQualityIssue: boolean;
}

export function scorePatientRisk(patient: Patient): PatientRiskResult {
  let score = 0;
  let hasFever = false;
  let hasDataQualityIssue = false;

  // Blood Pressure
  const bp = patient.blood_pressure;
  if (typeof bp === 'string' && /^\d+\/\d+$/.test(bp)) {
    const [systolic, diastolic] = bp.split('/').map(Number);
    if (systolic < 120 && diastolic < 80) score += 1;
    else if (systolic >= 120 && systolic <= 129 && diastolic < 80) score += 2;
    else if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) score += 3;
    else if (systolic >= 140 || diastolic >= 90) score += 4;
  } else {
    hasDataQualityIssue = true;
  }

  // Temperature
  const temp = typeof patient.temperature === 'string'
    ? parseFloat(patient.temperature)
    : patient.temperature;

  if (typeof temp === 'number' && !isNaN(temp)) {
    if (temp >= 99.6 && temp <= 100.9) {
      score += 1;
      hasFever = true;
    } else if (temp >= 101.0) {
      score += 2;
      hasFever = true;
    } else if (temp > 99.5) {
      hasFever = true;
    }
  } else {
    hasDataQualityIssue = true;
  }

  // Age
  const age = typeof patient.age === 'string'
    ? parseInt(patient.age)
    : patient.age;

  if (typeof age === 'number' && !isNaN(age)) {
    if (age < 40) score += 1;
    else if (age <= 65) score += 1;
    else if (age > 65) score += 2;
  } else {
    hasDataQualityIssue = true;
  }

  return {
    patient_id: patient.patient_id,
    totalScore: score,
    hasFever,
    hasDataQualityIssue,
  };
}
