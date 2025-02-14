# Hospital Backend System Documentation

## Overview

The Hospital Backend System is a secure and intelligent platform that facilitates user authentication, patient-doctor assignments, encrypted doctor note submissions, and dynamic scheduling of reminders based on live LLM processing. The system is designed to ensure data security, efficient scheduling, and AI-powered decision-making.

## Features

1. **User Management**
   * User registration with name, email, and password.
   * Role-based access control (RBAC) for Patients and Doctors.
   * Authentication using JWT.
   * End-to-end encryption (E2EE) for patient notes.
2. **Patient-Doctor Assignment**
   * Patients select doctors upon registration.
   * Doctors can view a list of assigned patients.
3. **Doctor Notes & Actionable Steps**
   * Doctors submit patient notes.
   * Integration with Gemini API to extract actionable steps:
     * **Checklist** : Immediate one-time tasks.
     * **Plan** : Scheduled recurring actions.
   * Dynamic scheduling of reminders based on the patient’s response.
   * Previous actionable steps are canceled upon new note submissions.
4. **Reminders & Scheduling**
   * Cron jobs run at  **6 AM, 12 PM, 6 PM, and 10 PM** .
   * Reminders are categorized based on medication schedules ( **once, twice, thrice, or four times daily** ).
   * Email notifications are sent to patients at scheduled times.
   * Reminders are updated upon user response.
5. **API Endpoints**
   * User authentication and registration.
   * Patient-doctor selection.
   * Doctor retrieval of assigned patients.
   * Doctor note submission with LLM processing.
   * Retrieving actionable steps and reminders.
   * A complete information about the API routes, their request and response types can be found in the Swagger documentation and the Postman collection in the folder structure called `gigsama.postman_collection.json`.
6. **Email Service**
   * Automated email notifications for scheduled reminders.

## API Routes

### Authentication Routes (`/api/v0/auth`)

#### `POST /signup/doctor`

* **Request Body Example:**
  ```json
  {
    "firstName": "the first name of the user",
    "lastName": "the last name of the user",
    "email": "the email of the user",
    "publicKey": "the public key, must begin with -----BEGIN PUBLIC KEY----- and end with -----END PUBLIC KEY-----",
    "password": "password"
  }
  ```
* **Response Type:**
  ```json
  {
    "data": {
      "access_token": "the access token"
    }
  }
  ```
* **Notes:** Creates a new doctor account.

#### `POST /signup/patient`

* **Request Body Example:** Same as `/signup/doctor`.
* **Notes:** Creates a new patient account.

#### `POST /signin`

* **Request Body Example:**
  ```json
  {
    "email": "the email of the user",
    "password": "password"
  }
  ```
* **Response Type:** Same structure as `/signup/doctor` response.
* **Notes:** Authenticates a user (either doctor or patient).

#### `POST /forgot-password`

* **Request Body Example:**
  ```json
  {
    "email": "the email of the user",
    "resetUrl": "the password reset URL"
  }
  ```
* **Response Type:**
  ```json
  {
    "message": "Password reset email sent successfully."
  }
  ```
* **Notes:** Initiates the password reset process.

#### `PATCH /reset-password/:token`

* **Request Body Example:**
  ```json
  {
    "newPassword": "new password",
    "confirmPassword": "confirm new password"
  }
  ```
* **Response Type:**
  ```json
  {
    "message": "Password reset successful."
  }
  ```

### User Routes

#### `GET /doctors/me`

* **Request:** Requires doctor's access token.
* **Response Type:**
  ```json
  {
    "data": {
      "userId": "user ID",
      "firstName": "first name",
      "lastName": "last name",
      "email": "email"
    }
  }
  ```
* **Notes:** Retrieves the profile information of the authenticated doctor.

#### `GET /patients/me`

* **Request:** Requires patient's access token.
* **Response Type:** Similar to `/doctors/me` response.
* **Notes:** Retrieves the profile information of the authenticated patient.

### Patient-Doctor Relationship Routes

#### `POST /patients/assign-doctor`

* **Request Body Example:**
  ```json
  {
    "doctorId": "the doctor’s ID"
  }
  ```
* **Response Type:**
  ```json
  {
    "data": {
      "relation": {
        "id": "relation ID",
        "patientId": "patient ID",
        "doctorId": "doctor ID"
      }
    }
  }
  ```
* **Notes:** Assigns a doctor to the authenticated patient.

#### `GET /doctors/patients`

* **Request:** Requires doctor's access token.
* **Response Type:**
  ```json
  {
    "data": [
      {
        "patientId": "patient ID",
        "firstName": "first name",
        "lastName": "last name"
      }
    ]
  }
  ```

#### `PUT /doctors/notes`

* **Request Body Example:**
  ```json
  {
    "note": "the doctor’s note",
    "relationId": "the relation ID"
  }
  ```
* **Response Type:**
  ```json
  {
    "message": "Note submitted successfully."
  }
  ```

## Tests

run `npm run test:e2e` to run end-to-end test
Tests are also available in the postman collection

## Deployment

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Set up the PostgreSQL database.
4. Configure environment variables.
5. Run the server using `npm run start`.

## Error Handling

* All errors follow the general structure:
  ```json
  {
    "status": "error",
    "message": "a descriptive error message"
  }
  ```

## Importing and Using the Postman Collection

1. Open Postman.
2. Click on **File** >  **Import** .
3. Select the `gigsama.postman_collection.json` file from the project folder.
4. Click **Import** to load the collection.
5. Open the imported collection from the **Collections** tab.
6. Configure environment variables if required (e.g., base API URL, authentication tokens).
7. Use the collection to test API endpoints directly within Postman.

## Technology Stack

* **Backend Framework** : NestJS (TypeScript)
* **Database** : PostgreSQL (Docker container)
* **ORM** : Prisma
* **Authentication** : JWT-based authentication and RBAC
* **Encryption** : E2EE using public-key cryptography
* **Task Scheduling** : `nestjs/schedule` for cron jobs
* **AI Integration** : Gemini API for extracting actionable steps
* **Documentation** : Swagger (accessible at `/api/v0/documentation`)

## Justification for Design Decisions

* **NestJS for Backend:** Chosen for its modular structure, TypeScript support, and built-in dependency injection, which makes it ideal for scalable applications.
* **PostgreSQL as Database:** Offers strong ACID compliance and reliability for handling sensitive hospital records.
* **Prisma ORM:** Provides type safety, ease of migrations, and minimizes runtime errors.
* **JWT Authentication:** Enables secure, stateless authentication that scales well.
* **End-to-End Encryption:** Ensures confidentiality of sensitive patient data; the public key provided by the client is used to encrypt notes, ensuring that only the intended recipient can decrypt them.
* **Cron Job-Based Reminders:** Efficient scheduling using `nestjs/schedule` for reliable, time-based reminder notifications.
* **AI-Powered Actionable Steps:** Integration with the Gemini API enhances decision-making by automatically extracting key insights from doctor notes.
* **Logger Module:** Integrated for logging important messages, debugging, and operational monitoring, which is critical for maintaining a secure and robust system.
* **Comprehensive Documentation:** Swagger and Postman collections provide complete information about API routes, request/response types, and usage instructions, ensuring ease of use for developers.

## Project Author

**Louis Marie Atoluko Ayariga**

* [LinkedIn](https://www.linkedin.com/in/marieloumar/)
* [Website](https://marieloumar-website.vercel.app/)

---

This documentation provides a clear understanding of the system’s functionality, design choices, and deployment instructions. Additional details can be added as necessary.
