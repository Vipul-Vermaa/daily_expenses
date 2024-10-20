# Daily Expenses Sharing Application

This application is a backend for a daily-expenses sharing application. This 
application will allow users to add expenses and split them based on three 
different methods: exact amounts, percentages, and equal splits

## Table of Contents

- Getting Started
- Prerequisites
- Environment Variables
- Running the Application
- Testing
- License

## Getting Started
To get started with the project, follow these instructions

### Prerequisites
Make sure you have the following installed:

- Node.js (version 14 or later)
- MongoDB (either local or cloud instance)
- npm (Node Package Manager)

### Installation
1. Clone the repository:

```bash
git clone https://github.com/Vipul-Vermaa/daily_expenses.git
cd daily_expenses
```
2. Install dependencies:
```bash
npm install
```
3. Create a .env file in the root directory to store your environment variables:
4. Add the following variables to the .env file:
```bash
MONGO_URI=your_mongo_uri
PORT=4000
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=your_frontend_url
```
## Environment Variables
You need to define the following environment variables in the .env file:

- MONGO_URI: The MongoDB URI to connect to your database.
- PORT: The port number on which your server will run.
- JWT_SECRET: Secret key for JWT authentication.

## Running the Application
### To start the server, run:
```bash
npm run dev
```
This will start the application on the port specified in the .env file 

## Testing
Tests are written using Jest and Supertest. To run the tests:

1. Make sure your test database is set up. You can use a separate MongoDB instance or MongoDB Memory Server.

2. Run the test suite:
```bash
npm test
```


## License

[MIT](https://choosealicense.com/licenses/mit/)