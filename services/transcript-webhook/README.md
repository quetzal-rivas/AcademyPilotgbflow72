# Transcript Webhook Service

This microservice handles the end-of-conversation webhooks dispatched by the ElevenLabs Student Intake Agent. Its primary purpose is to process the conversation transcript, identify any unprocessed leads generated within the last 24 hours, and, if found, asynchronously trigger another Lambda function (`trigger-outbound-call`) to have the Sally agent report those leads to the academy.

## Operation

1.  **Trigger:** ElevenLabs sends a `POST` request at the end of a conversation.
2.  **Transcript Extraction:** The service extracts the transcript text from the payload.
3.  **Query Firestore:** It searches the `leads` collection for documents where `processed` is `false` and `createdAt` is within the last 24 hours.
4.  **Asynchronous Invocation:** If unprocessed leads exist and the `TRIGGER_OUTBOUND` environment variable is set to `true`, it uses the AWS SDK to asynchronously invoke the `OUTBOUND_LAMBDA_NAME` function, passing along the leads and the transcript.
5.  **Response:** It immediately returns a `200 OK` to ElevenLabs to prevent webhook retries, regardless of whether the outbound call was triggered or if an internal error occurred during processing.

## Environment Variables

-   `FIREBASE_SERVICE_ACCOUNT`: Service account JSON for Firestore access.
-   `TRIGGER_OUTBOUND`: A safety switch. Set to `"true"` to enable outbound calls, or `"false"` to disable them (useful for testing).
-   `OUTBOUND_LAMBDA_NAME`: The name of the Lambda function to invoke (e.g., `triggerOutboundCallHandler`).

## Deployment

This service is defined using AWS SAM. It includes the Lambda function, its execution role, and a specific policy allowing it to asynchronously invoke the outbound call Lambda function.

```bash
npm install
sam build
sam deploy --guided
```
