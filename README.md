# E-Ticket-Booking-System-Backend
 
# 🎟️ E-Ticket Booking System (Backend)

This is the **backend** of the **E-Ticket Booking System** application, built with **Node.js, Express, and MongoDB**.  
It provides the RESTful API for handling bookings, user management, and authentication.

---

## 🚀 Tech Stack
- **Node.js** – Runtime environment  
- **Express.js** – Web framework  
- **MongoDB + Mongoose** – Database and ODM  
- **JWT (JSON Web Token)** – Authentication  
- **BCrypt.js** – Password hashing  

---

## 📂 Project Structure
```
/backend
│── /config        # Database and environment configs
│── /controllers   # Route controllers (business logic)
│── /models        # Mongoose models (User, Booking, Ticket)
│── /routes        # Express routes (API endpoints)
│── /middleware    # Auth middleware
│── server.js      # App entry point
```

---

## ⚙️ Features
- 🔑 **User Authentication** with JWT  
- 👤 **Role-based Access** (User/Admin)  
- 🎫 **Book, Cancel, and View Tickets**  
- 📋 **Booking History**  
- 🛠️ **Admin APIs** for managing tickets and users  

---

## 🖥️ Setup & Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/AzghanAhmad/E-Ticket-Booking-System-Backend.git
   ```
2. Navigate to the backend folder:
   ```bash
   cd e-ticket-booking-system/app/backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a **.env** file in the backend folder with the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
5. Start the backend server:
   ```bash
   npm start
   ```
   The API should now be running at **http://localhost:5000**

---

## 📡 API Endpoints (Examples)
- **POST** `/api/auth/register` – Register new user  
- **POST** `/api/auth/login` – Login user and return token  
- **GET** `/api/bookings` – Get user bookings (auth required)  
- **POST** `/api/bookings` – Create a new booking  
- **DELETE** `/api/bookings/:id` – Cancel a booking  
- **GET** `/api/admin/users` – Admin only: get all users  

---

## 📜 License
```
Copyright (c) 2025 Azghan Ahmad

All Rights Reserved.

This repository contains the source code for the "E-Ticket Booking System" application.  
All rights to this project, including but not limited to source code, design, and documentation,  
are owned by the project owner.

Unauthorized copying, modification, distribution, or use of this project,  
in whole or in part, is strictly prohibited without prior written permission  
from the owner.
```

---

## 👤 Author
**Azghan Ahmad**  
- GitHub: [AzghanAhmad](https://github.com/AzghanAhmad)  
- Email: azghanduplicate786@gmail.com
