# Add Lead Service

This is a specialized backend microservice responsible for adding a new lead to the Firestore database.

## Mission Objective

To receive lead information via the central `UniversalTacticalOrchestrator`, validate it (including ensuring tenant isolation), and persist it as a new document in the `leads` collection.

## Invocation

This function is not intended to be called directly. It is invoked exclusively by the `Orchestrator` Lambda function when a request with the `ADD_LEAD` action is dispatched.

## Request Payload

The `Orchestrator` passes a payload to this function. The `tenantSlug` is **mandatory** to ensure the lead is associated with the correct academy.

### Payload Parameters:

-   **`tenantSlug` (Required):** The unique identifier for the academy/tenant receiving the lead.
-   **`name` (Required):** The full name of the lead.
-   **`phone` (Required):** The contact phone number for the lead.
-   `clase` (Optional): The specific class or program they are interested in.
-   `visit_date` (Optional): An intended date for a trial class or visit.
-   `note` (Optional): Any additional context or remarks.
-   `uniform` (Optional): A boolean indicating if they already own an official uniform.
-   `source` (Optional): Identifies where the lead originated (e.g., 'landing_page', 'facebook_ad').

### Example Payload:

```json
{
  "tenantSlug": "gb-demo",
  "name": "Jane Smith",
  "phone": "+19876543210",
  "clase": "Women's Self Defense",
  "visit_date": "2024-06-15",
  "note": "Has some prior grappling experience.",
  "uniform": false,
  "source": "instagram_promo"
}
```

## Environment Variables

-   `FIREBASE_SERVICE_ACCOUNT`: A JSON string containing the Firebase service account credentials.

## Deployment

This service is defined using the AWS Serverless Application Model (SAM).

```bash
sam build
sam deploy --guided
```