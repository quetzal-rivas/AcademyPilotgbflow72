# Get Leads Service

This microservice retrieves a list of leads from the Firestore database. It is invoked by the Orchestrator and supports multi-tenant data isolation, filtering, sorting, and pagination.

## Operation

The service receives a payload from the Orchestrator. The `tenantSlug` is **mandatory** for security and data isolation.

### Payload Parameters:

- **`tenantSlug` (Required):** The unique identifier for the academy/tenant requesting the leads. Without this, the query will be rejected.
- `limit` (Optional): The maximum number of leads to return (default: 100).
- `orderBy` (Optional): The field to sort by (default: `createdAt`).
- `order` (Optional): The sort direction (`asc` or `desc`, default: `desc`).
- `includeProcessed` (Optional): Whether to include leads that have already been processed (default: `false`).

### Example Payload:

```json
{
  "tenantSlug": "gb-demo",
  "limit": 50,
  "orderBy": "createdAt",
  "order": "desc",
  "includeProcessed": true
}
```

It queries the `leads` collection in Firestore, strictly filtering by the provided `tenantSlug`, and returns an array of lead documents.

## Deployment

This service is defined using AWS SAM. To deploy:

```bash
npm install
sam build
sam deploy --guided
```