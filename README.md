# Real Estate Rental and Tenant Management System - Property Plus

Property Plus is a real estate rental and tenant management system. It is a web application that allows users to manage their properties and tenants. It is a full stack application that uses the following technologies:

Live Site - [Property Plus](https://property-plus.netlify.app/)

## Features

- Post a property for rent
- Search and filter properties
- View property details
- Send email to the owner of the property
- Create Property Contract
- Manage tenants
- Register Rent Payment

## Configuration and Installation Instructions

### Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [React.js](https://facebook.github.io/react/)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Cloudinary](https://cloudinary.com/)
- [Ethereal Email](https://ethereal.email/)

1. Clone the repository:

```bash
$ git clone https://github.com/SonamRinzinGurung/Real-Estate-Rental-and-Tenant-Management-System.git
```

2. Install the required packages for the backend:

```bash
$ cd server
$ npm install
```

3. Install the required packages for the frontend:

```bash
$ cd client
$ npm install
```

4. Configure the environment variables:

```bash
$ cd server

- create a .env file and add the following variables:
- generate secret keys for jwt tokens using online tools

MONGO_URI= <your_mongo_uri>
ACCESS_TOKEN_SECRET_OWNER= <your_access_token_secret_owner>
ACCESS_TOKEN_SECRET_TENANT= <your_access_token_secret_tenant>
REFRESH_TOKEN_SECRET_OWNER= <your_refresh_token_secret_owner>
REFRESH_TOKEN_SECRET_TENANT= <your_refresh_token_secret_tenant>
ACCESS_LIFETIME=15m
REFRESH_LIFETIME=7d
CLOUDINARY_API_KEY= <your_cloudinary_api_key>
CLOUDINARY_API_SECRET= <your_cloudinary_api_secret>
RESET_PASSWORD_KEY= <your_reset_password_key>
EMAIL_VERIFICATION_KEY= <your_email_verification_key>
CLIENT_URL=http://localhost:3000
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER= <your_ethereal_email_user>
EMAIL_PASS= <your_ethereal_email_pass>
```

5. Run the application:

```bash
$ cd server
$ npm run dev
```

## Author

[Sonam Rinzin Gurung](https://github.com/SonamRinzinGurung)

## Repository

[Property Plus](https://github.com/SonamRinzinGurung/Real-Estate-Rental-and-Tenant-Management-System)
