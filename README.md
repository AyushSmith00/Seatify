# Seatify — Event Ticket Booking Platform

Seatify is a full-stack event ticket booking platform where organizers can create and manage events, and users can browse and book tickets seamlessly.

Built as a real-world project to demonstrate backend architecture, authentication, booking logic, and payment integration.

---

## Features

### Authentication
- User registration and login
- JWT-based authentication (Access and Refresh tokens)
- Secure HTTP-only cookies
- Logout with token invalidation

### Events
- Organizers can create and manage events
- Public event listing
- Event details with available seats

### Booking System
- Users can book tickets for events
- Seat availability tracking (no overbooking logic)
- Booking records stored in database

### Payments
- Razorpay integration (test mode)
- Order creation API
- Payment verification using HMAC SHA256

---

## Tech Stack

Backend:
- Node.js
- Express.js
- PostgreSQL (Docker)
- Prisma ORM

Authentication:
- JWT (Access and Refresh Tokens)
- bcrypt (password hashing)

Payments:
- Razorpay API

---


## Setup Instructions
```bash

### 1. Clone the repository

git clone https://github.com/yourusername/seatify.git
cd seatify
2. Install dependencies
npm install

3. Configure environment variables
Create a .env file in the root directory:

PORT=5000

DATABASE_URL=your_postgresql_url

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret

4. Run PostgreSQL using Docker
docker run --name seatify_db -p 5432:5432 -e POSTGRES_PASSWORD=yourpassword -d postgres

5. Prisma setup
npx prisma generate
npx prisma db push

6. Start the development server
npm run dev

API Endpoints
POST /api/auth/register

POST /api/auth/login

POST /api/auth/logout

GET /api/events

POST /api/events/create (Organizer only)

POST /api/bookings/:eventId

POST /api/payments/create-order

POST /api/payments/verify

Project Status
Backend complete
Payment integration complete
Frontend in progress

Future Improvements
Frontend (React)

Organizer dashboard UI

Booking history UI

Email notifications

Deployment to production

License

MIT License

Copyright (c) 2026 Ayush

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
