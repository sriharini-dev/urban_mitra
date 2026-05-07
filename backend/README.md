# Work Zone Backend

This backend starts with separate signup modules for:

- `user`
- `helper`

`admin` accounts should be created manually in the database and should not have a public signup route.

It also includes a shared login flow for:

- `admin`
- `user`
- `helper`

Additional MVP modules now included:

- `plans`
- `bookings`
- `admin`

## Latest Backend Update

Last updated: `2026-05-07`

Recent backend changes:

- Added safer JSON body parsing for `application/json` requests
- Prevented HTML stack traces for malformed JSON request bodies
- Added clean JSON `400` responses for invalid request payloads
- Confirmed shared login flow for `admin`, `user`, and `helper`
- Confirmed admin approval flow for helper accounts before helper login

## Local API Base URL

When the backend runs locally, the base URL is:

```text
http://localhost:5000
```

## Setup

1. Copy `.env.example` to `.env`
2. Create the MySQL database using `database/schema.sql`
3. Install packages with `npm install`
4. Start the server with `npm run dev`

## Available Routes

### Health Check

- `GET /api/health`
- Full URL: `http://localhost:5000/api/health`

Example success response:

```json
{
  "success": true,
  "message": "Work Zone backend is running."
}
```

### User Signup

- `POST /api/users/signup`
- Full URL: `http://localhost:5000/api/users/signup`

Example request body:

```json
{
  "fullName": "Rahul Kumar",
  "email": "rahul@gmail.com",
  "phone": "9876543210",
  "password": "Rahul@123",
  "confirmPassword": "Rahul@123",
  "addressLine": "Madhapur, Street 2",
  "city": "Hyderabad",
  "pincode": "500081"
}
```

### Helper Signup

- `POST /api/helpers/signup`
- Full URL: `http://localhost:5000/api/helpers/signup`

Example request body:

```json
{
  "fullName": "Sita Devi",
  "email": "sita@gmail.com",
  "phone": "9123456780",
  "password": "Sita@123",
  "confirmPassword": "Sita@123",
  "addressLine": "Kukatpally, Road 5",
  "city": "Hyderabad",
  "pincode": "500072",
  "gender": "female",
  "dateOfBirth": "1998-06-14",
  "skills": ["cleaning", "cooking"],
  "experienceYears": 2,
  "availability": "morning",
  "idProofType": "Aadhaar",
  "idProofNumber": "XXXX-XXXX-1234",
  "about": "Experienced in household work and cooking."
}
```

### Login

- `POST /api/auth/login`
- Full URL: `http://localhost:5000/api/auth/login`

Example request body:

```json
{
  "email": "admin@workzone.com",
  "password": "Admin@123"
}
```

### Plans

- `GET /api/plans`
- `POST /api/plans` (admin token required)
- Full URL for list plans: `http://localhost:5000/api/plans`
- Full URL for create plan: `http://localhost:5000/api/plans`

Example create-plan request body:

```json
{
  "name": "Standard Plan",
  "description": "Best for small families",
  "price": 4999,
  "durationDays": 30,
  "visitsPerMonth": 12,
  "features": ["cleaning", "cooking", "laundry"]
}
```

### Bookings

- `POST /api/bookings` (user token required)
- `GET /api/bookings/my` (user/helper/admin token required)
- `PATCH /api/bookings/:id/status` (admin token required)
- Full URL for create booking: `http://localhost:5000/api/bookings`
- Full URL for my bookings: `http://localhost:5000/api/bookings/my`
- Full URL for booking status update: `http://localhost:5000/api/bookings/:id/status`

Example booking request body:

```json
{
  "planId": 1,
  "serviceDate": "2026-05-03",
  "timeSlot": "09:00 AM - 11:00 AM",
  "notes": "Please bring cleaning supplies.",
  "addressLine": "Madhapur, Street 2",
  "city": "Hyderabad",
  "pincode": "500081"
}
```

### Admin

- `GET /api/admin/overview` (admin token required)
- `GET /api/admin/helpers` (admin token required)
- `GET /api/admin/helpers?status=pending` (admin token required)
- `PATCH /api/admin/helpers/:id/status` (admin token required)
- Full URL for overview: `http://localhost:5000/api/admin/overview`
- Full URL for helper list: `http://localhost:5000/api/admin/helpers`
- Full URL for pending helpers: `http://localhost:5000/api/admin/helpers?status=pending`
- Full URL for helper status update: `http://localhost:5000/api/admin/helpers/:id/status`

Example helper status update request body:

```json
{
  "status": "active"
}
```

Example success response:

```json
{
  "success": true,
  "message": "Login successful.",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "fullName": "Admin",
    "email": "admin@workzone.com",
    "phone": "9999999999",
    "role": "admin",
    "status": "active"
  }
}
```

## Code Structure

- `modules/auth`: shared login route, controller, service, validator
- `modules/user`: customer signup route, controller, service, validator
- `modules/helper`: helper signup route, controller, service, validator
- `modules/plan`: plan listing and admin plan creation
- `modules/booking`: booking creation, booking listing, booking status updates
- `modules/admin`: admin overview, helper review, helper approval updates
- `middleware`: JWT authentication and role-based access control
- `middleware/jsonBodyParser.js`: safer JSON parsing and malformed JSON error handling
- `config`: shared database setup

This separation keeps the code easier to read and explain in an interview.
