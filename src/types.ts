
// patient interface
export interface Patient {

    patient_id: string;
    name: string;
    age: number | string | null;
    gender?: string;
    blood_pressure?: string | null;
    temperature?: number | string | null;
    visit_date: string;
    diagnosis: string;
    medications: string;

}

//pagination interface
export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}


export interface PaginatedResponse {
  data: Patient[];
  pagination: PaginationInfo;
}

export interface SubmissionPayload {
  high_risk_patients: string[];
  fever_patients: string[];
  data_quality_issues: string[];
}