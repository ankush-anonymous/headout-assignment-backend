# Headout Feedback Form Proxy Server

## Overview

This proxy server acts as an intermediary between the Headout frontend feedback form and Google Sheets. It receives form submissions from the frontend and securely forwards them to a Google Apps Script endpoint, which then populates the data into Google Sheets.

## Benefits of Using a Proxy Server

1. **Security**

   - Hides the Google Apps Script URL from client-side code
   - Provides a layer of abstraction between frontend and backend services
   - Allows implementation of authentication and rate limiting if needed

2. **CORS Handling**

   - Eliminates cross-origin resource sharing (CORS) issues that might occur with direct Apps Script calls
   - Provides a consistent API endpoint for the frontend

3. **Error Handling & Logging**

   - Centralizes error handling and logging
   - Enables better monitoring and debugging of form submissions
   - Can implement custom error responses and retries

4. **Scalability**
   - Easier to implement caching if needed
   - Can add request queuing for high traffic scenarios
   - Allows for future expansion of functionality without frontend changes

## Tech Stack

- Node.js
- Express.js
- Axios
- CORS middleware

## Setup and Running

1. **Clone the Repository**

   ```bash
   git clone [repository-url]
   cd [repository-name]
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Run the Server**
   ```bash
   npm start
   ```
   The server will start running on `http://localhost:3000`

## API Endpoints

### POST `/proxy/feedback`

Handles feedback form submissions and forwards them to the Feedback Sheet.

**Purpose:**

- Processes structured feedback data from the frontend feedback form
- Forwards submissions to a dedicated Feedback Sheet in Google Sheets
- Validates input data before transmission

**Request Format:**

```json
{
  "name": "string",
  "email": "string",
  "feedback": "string",
  "rating": "number"
}
```

### POST `/proxy/rawdata`

Handles raw data submissions and manages multi-sheet operations.

**Purpose:**

- Accepts raw data input from various sources
- Primary insertion into the Raw Data Sheet
- Triggers automatic data copying to the Dashboard Sheet
- Enables further data manipulation and analysis in the Dashboard

**Request Format:**

```json
{
  "timestamp": "string",
  "data": "object",
  "source": "string"
}
```

**Note:** Both endpoints implement error handling and validation to ensure data integrity before transmission to Google Sheets.

## Environment Variables

- `PORT`: Server port (default: 3000)
- `APPSCRIPT_URL`: Google Apps Script deployment URL (optional)
- `RENDER_BACKEND_URL`: "https://headout-assignment-backend.onrender.com"
- `FEEDBACK_SHEET_URL`: "https://docs.google.com/spreadsheets/d/19EFGH-0wkPykiPWRvn9hNUDvTGuYf9iEBFyeoBn3xiQ/edit?usp=sharing"
- `RAWDATA_SHEET_URL`: "https://docs.google.com/spreadsheets/d/18KciqH7pLy0zYaQwgs1QBnpFYZyidlDhR6sE5nNQq6U/edit?usp=sharing"
