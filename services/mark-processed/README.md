# Mark Processed Service

This microservice is responsible for marking a batch of leads as processed in the Firestore database. It is typically invoked by a webhook from an outbound calling agent (like "Sally") after it successfully calls the academy to report on new leads.

## Operation

1.  **Trigger:** An external webhook sends a `POST` request.
2.  **Authorization:** The service verifies the `Authorization: Bearer <AUTH_TOKEN>` header. If invalid, it returns a 200 OK to avoid breaking the webhook sender (e.g., ElevenLabs) but logs a warning and ignores the payload.
3.  **Parse Payload:** It expects a JSON body with an array of `lead_ids` and optional `metadata`.
4.  **Batch Update:** It performs a batch write to Firestore, updating the `processed` flag to `true`, adding a `processedAt` timestamp, and storing any provided metadata for each specified lead document.

## Payload Contract

The expected payload format is:

```json
{
  "lead_ids": ["lead_id_1", "lead_id_2"],
  "metadata": {
    "call_duration": 120,
    "outcome": "scheduled"
  }
}
```

## Environment Variables

-   `AUTH_TOKEN`: The secret token expected in the Authorization header.
-   `FIREBASE_SERVICE_ACCOUNT`: Service account JSON for Firestore access.

## Deployment

This service is defined using AWS SAM. It includes the Lambda function and the necessary IAM policies.

```bash
npm install
sam build
sam deploy --guided
```
