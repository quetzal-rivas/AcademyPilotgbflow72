# Trigger Outbound Call Service

This microservice acts as an asynchronous processor in the automated lead pipeline. It is invoked by the `transcript-webhook` service when unprocessed leads are identified after a student intake call.

## Operation

1.  **Trigger:** Asynchronously invoked via the AWS SDK by the `transcript-webhook` service.
2.  **Input Validation:** Receives a payload containing an array of `leads` and the related conversation `transcript`.
3.  **Data Formatting:** It iterates through the provided leads and constructs a natural language summary suitable for a voice agent.
4.  **ElevenLabs API Invocation:** It prepares a payload for the ElevenLabs API, injecting the generated lead summary into a dynamic variable (`lead_summary`). It then makes a `POST` request to the ElevenLabs `/v1/convai/twilio/outbound-call` endpoint to initiate a call from the "Sally" agent to the configured academy phone number.

## Environment Variables

-   `ELEVENLABS_API_KEY`: API key for ElevenLabs.
-   `SALLY_AGENT_ID`: The ID of the ElevenLabs agent configured to make academy calls (e.g., `agent_5101kh4k6hxvezmsa2tbwp0y6mvs`). The agent's prompt must be configured to utilize the `{{lead_summary}}` dynamic variable.
-   `ELEVENLABS_PHONE_ID`: The Twilio phone number ID associated with the ElevenLabs account.
-   `ACADEMY_PHONE`: The destination phone number to call (e.g., `+13059293241`).

## Deployment

This service is defined using AWS SAM. It includes the Lambda function and its necessary configuration.

```bash
npm install
sam build
sam deploy --guided
```