School Payment and Dashboard ApplicationThis project is a full-stack application for managing school payments and transactions. It consists of a backend microservice and a responsive frontend dashboard.FeaturesBackend (Node.js)REST API: A microservice built with Node.js and NestJS for managing transactions and payments.Payment Gateway Integration: Integrates with the Edviron Payment API to generate payment links and handle transactions.Webhook Integration: A dedicated endpoint to receive and process webhook payloads for real-time transaction status updates.JWT Authentication: All API endpoints are secured using JSON Web Tokens (JWT).Database Management: Uses MongoDB Atlas to store order, transaction, and webhook log data.API Endpoints:POST /create-payment: Initiates a payment request.POST /webhook: Receives payment updates from the gateway.GET /transactions: Fetches a paginated and sortable list of all transactions.GET /transactions/school/:schoolId: Fetches all transactions for a specific school.GET /transaction-status/:custom_order_id: Checks the status of a specific transaction.Error Handling & Validation: Proper data validation and consistent error responses.Scalability & Performance: Implements pagination, sorting, and database indexing for efficient data retrieval.Frontend (React.js)Responsive Dashboard: A user-friendly interface built with React.js.API Integration: Uses Axios to fetch and manage data from the backend APIs.Dashboard Pages:Transactions Overview: Displays a searchable and sortable table of all transactions. Includes multi-select filters for status, school IDs, and date ranges.Transaction Details by School: A dedicated page to view transactions for a specific school ID.Transaction Status Check: A modal or page to check the status of a transaction using its custom order ID.Styling: Styled using Tailwind CSS to ensure a modern and responsive design.Project SetupPrerequisitesNode.js (LTS version recommended)MongoDB Atlas accountPayment Gateway credentials (provided in the assessment document)Backend SetupClone the repository:git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
cd your-repo-name/backend
Install dependencies:npm install
Create a .env file in the root directory and add the following environment variables:MONGO_URI="your_mongodb_atlas_connection_string"
PG_KEY="edvtest01"
API_KEY="your_api_key"
SCHOOL_ID="your_school_id"
JWT_SECRET="your_jwt_secret"
JWT_EXPIRY="1h"
Run the application:npm run start
Frontend SetupNavigate to the frontend directory:cd ../frontend
Install dependencies:npm install
Create a .env file in the root directory for your API URL.VITE_BACKEND_API_URL="http://localhost:3000" # or your hosted backend URL
Run the application:npm run dev
API DocumentationPayment Gateway API IntegrationThis project integrates with the Edviron Payment API. The documentation for the external APIs is as follows:Create Payment:Endpoint: POST https://dev-vanilla.edviron.com/erp/create-collect-requestDescription: Generates a payment link for a given school and amount.Authentication: Bearer Token.Request Body:{
  "school_id": "<string>",
  "amount": "<string>",
  "callback_url": "<string>",
  "sign": "<string>" // JWT signed payload
}
JWT Payload for sign:{
  "school_id": "<string>",
  "amount": "<string>",
  "callback_url": "<string>"
}
Response:{
  "collect_request_id": "6808bc4888e4e3c149e757f1",
  "Collect_request_url": "<url>",
  "sign": "<string>" // JWT token
}
Check Payment Status:Endpoint: GET https://dev-vanilla.edviron.com/erp/collect-request/{collect_request_id}?school_id={school_id}&sign={sign}Description: Checks the status of a previously created payment request.Authentication: Bearer Token.Query Parameters:collect_request_id: The unique ID returned when the request was created.school_id: The unique school ID.sign: JWT signed payload.JWT Payload for sign:{
  "school_id": "<string>",
  "collect_request_id": "<string>"
}
Response:{
  "status": "SUCCESS",
  "amount": 100,
  "details": {},
  "payment_methods": null,
  "jwt": "<token>"
}
Backend Internal API EndpointsGET /transactionsDescription: Fetches all transactions with pagination and sorting support.Query Parameters: ?limit=10&page=1&sort=payment_time&order=descGET /transactions/school/:schoolIdDescription: Fetches all transactions for a specific school.GET /transaction-status/:custom_order_idDescription: Returns the current status of a transaction.POST /webhookDescription: Receives and processes webhook payload from the payment gateway to update the database.Postman CollectionA Postman collection is highly recommended for testing all API endpoints. You will need to import the collection and configure your environment variables with the necessary keys.Database SchemasOrder Schema_id: ObjectIdschool_id: ObjectId/stringtrustee_id: ObjectId/stringstudent_info: { name: string, id: string, email: string }gateway_name: stringOrder Status Schemacollect_id: ObjectId (references Order schema)order_amount: numbertransaction_amount: numberpayment_mode: stringpayment_details: stringbank_reference: stringpayment_message: stringstatus: stringerror_message: stringpayment_time: DateWebhook Logs SchemaCustom schema to store webhook-related logs for debugging.ScreenshotsTransaction Table Layout:DeploymentThe project can be deployed to a cloud platform. The backend can be hosted on services like Heroku or AWS, while the frontend can be deployed to Netlify, Vercel, or AWS Amplify.
