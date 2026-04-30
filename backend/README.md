# Work Zone Backend

This backend starts with separate signup modules for:

- `user`
- `helper`

`admin` accounts should be created manually in the database and should not have a public signup route.

It also includes a shared login flow for:

- `admin`
- `user`
- `helper`

## Setup

1. Copy `.env.example` to `.env`
2. Create the MySQL database using `database/schema.sql`
3. Install packages with `npm install`
4. Start the server with `npm run dev`

## Available Routes

### User Signup

- `POST /api/users/signup`

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

Example request body:

```json
{
  "email": "admin@workzone.com",
  "password": "Admin@123"
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
- `config`: shared database setup

This separation keeps the code easier to read and explain in an interview.
