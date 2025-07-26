# DemoMed Healthcare Risk Assessment

This project processes paginated patient data from the DemoMed API to compute clinical risk scores based on blood pressure, temperature, and age. It also flags patients with fever and data quality issues, and submits the results back to the API for validation.

---

## Features

- Fetches paginated patient data with retry logic for:
  - Malformed API responses
  - Rate limit delays
- Computes a clinical risk score for each patient
- Identifies:
  - High-risk patients (total score ≥ 4)
  - Patients with fever (temperature ≥ 99.6°F)
  - Patients with data quality issues (invalid or missing fields)
- Submits the result to the API for scoring
- Type-safe implementation using TypeScript

---

## Risk Scoring Criteria

### Blood Pressure

| Category        | Criteria                                | Score |
| --------------- | --------------------------------------- | ----- |
| Normal          | Systolic <120 and Diastolic <80         | 1     |
| Elevated        | Systolic 120–129 and Diastolic <80      | 2     |
| Stage 1         | Systolic 130–139 or Diastolic 80–89     | 3     |
| Stage 2         | Systolic ≥140 or Diastolic ≥90          | 4     |
| Invalid/Missing | Non-numeric, missing systolic/diastolic | 0     |

### Temperature

- ≥ 101.0°F → +1 risk point and flagged as fever
- 99.6–100.9°F → flagged as fever only

### Age

- > 65 → +2 points
- 40–65 → +1 point
- < 40 → 0 points

---

## High-Risk Definition

Patients are classified as high-risk if their total score (age + temperature + blood pressure) is 4 or higher.

---

## Data Quality Issues

A patient is flagged as having a data quality issue if:

- Blood pressure is invalid (e.g., "150/", "/90", "INVALID")
- Temperature is missing or non-numeric
- Age is null, undefined, or not a number

---

## Project Structure

```
src/
├── api.ts            # Fetches and paginates patient data
├── riskScorer.ts     # Scores patient risk based on provided rules
├── submit.ts         # Submits the results to the API
├── types.ts          # Patient type definitions
├── index.ts          # Main entry point
.env                  # API credentials and base URL
```

---

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up Environment

Create a `.env` file:

```
API_BASE_URL=https://your-api-url
API_TOKEN=your-api-token
```

### 3. Run the Script

```bash
npx ts-node src/index.ts
```

---

## Example Output

```
Summary Results
High Risk Patients:     [ 'DEMO001', 'DEMO002', ... ]
Fever Patients:         [ 'DEMO008', 'DEMO012', ... ]
Data Quality Issues:    [ 'DEMO005', 'DEMO007', ... ]
```

### Submission Response

```
Fever patients: Perfect score (9/9)
Data quality issues: Perfect score (8/8)
High-risk patients: 19/20 correct
Final score: 88%
```

---

## Tech Stack

- TypeScript
- ts-node
- dotenv

---

## Potential Improvements

- Add unit tests for risk scoring logic
- Improve handling of intermittent API errors
- Add logging for retries and errors
- Export results to CSV or a dashboard

---

## Author

Built by Joshua Koo for the DemoMed API challenge.
