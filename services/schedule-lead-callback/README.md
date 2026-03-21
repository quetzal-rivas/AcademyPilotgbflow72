# Schedule Lead Callback Service

This microservice provides a webhook endpoint for external systems (like an AI agent during a conversation) to programmatically add a lead to the outbound callback queue.

## Operation

1.  **Trigger:** An external system sends a `POST` request with a JSON payload.
2.  **Normalization:** It normalizes the incoming data, extracting fields like phone number, name, ID, and message (handling various potential property names like `lead_phone`, `phone`, or `variables.lead_phone`).
3.  **Validation:** It ensures the required `lead_phone` field is present.
4.  **Enqueuing:** It creates a new document in the `callback_queue` Firestore collection. Critically, it sets the status to `pending`, which makes the item eligible to be picked up by the `process-callback-queue` background worker.

## Payload Contract

The service accepts a flexible JSON payload. Example:

```json
{
  "lead_phone": "+15551234567",
  "lead_name": "Jane Doe",
  "lead_id": "12345",
  "clase": "Advanced BJJ",
  "message": "Interested in joining next week.",
  "priority": "high"
}
```

## Environment Variables

-   `FIREBASE_SERVICE_ACCOUNT`: Service account JSON for Firestore access.

## Deployment

This service is defined using AWS SAM.

```bash
npm install
sam build
sam deploy --guided
```