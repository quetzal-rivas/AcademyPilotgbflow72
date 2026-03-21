# Process Callback Queue Service

This microservice acts as a background worker, periodically invoked by an AWS EventBridge rule (currently configured for every 1 minute). Its primary responsibility is to process pending items in the `callback_queue` Firestore collection.

## Operation

1.  **Trigger:** EventBridge invokes the Lambda.
2.  **Validation:** It first checks if all necessary configurations (API keys, Agent IDs) are present.
3.  **Operational Hours Check:** It queries the `schedule` collection in Firestore to determine if the academy is currently open based on the local time (configured via the `TZ` environment variable). If closed, it skips processing.
4.  **Fetch Pending Leads:** It retrieves the oldest pending item from the `callback_queue` (FIFO approach, limited to 1 item per invocation to avoid rate limits).
5.  **Schedule Check:** If an item has a `scheduled_for` timestamp that is in the future, it is skipped until that time arrives.
6.  **Outbound Call:** If it's time, the service constructs a payload using the lead's data and initiates an outbound call via the ElevenLabs API using the specified `CALLBACK_AGENT_ID`.
7.  **Status Update:**
    -   **Success:** The queue item status is updated to `completed`, and the ElevenLabs conversation ID is saved.
    -   **Failure:** If the call fails, the `attempt_count` is incremented. The status remains `pending` until it reaches 3 retries, at which point it is marked as `failed`.

## Environment Variables

-   `ELEVENLABS_API_KEY`: API key for ElevenLabs.
-   `CALLBACK_AGENT_ID`: The ID of the ElevenLabs agent designated for follow-up calls (e.g., `agent_2001khfa9cn7fqab8wrv2ertt7jb`).
-   `CALLBACK_PHONE_ID`: The phone number ID associated with the agent.
-   `FIREBASE_SERVICE_ACCOUNT`: Service account JSON for Firestore access.
-   `TZ`: The timezone of the academy (e.g., `America/New_York`) to accurately check operational hours.

## Deployment

This service is defined using AWS SAM. It includes the Lambda function, an EventBridge rule for the cron trigger, and the necessary permissions.

```bash
npm install
sam build
sam deploy --guided
```
