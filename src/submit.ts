import axios from 'axios';
import { HEALTH_API_KEY, WEB_API_URL } from './constants';
import { SubmissionPayload } from './types';

export async function submitAssessment(payload: SubmissionPayload) {
  const url = `${WEB_API_URL}/submit-assessment`;

  try {
    const response = await axios.post(url, payload, {
      headers: {
        'x-api-key': HEALTH_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    console.log('\nSubmission Result:');
    console.dir(response.data, { depth: null });
  } catch (error) {
    console.error('Submission failed:', (error as any).message);
    if ((error as any).response?.data) {
      console.error('Server response:', (error as any).response.data);
    }
  }
}
