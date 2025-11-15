# MERN E-Commerce Platform

## Overview

A full-stack, responsive e-commerce application built with the **MERN** stack (MongoDB, Express, React, Node.js). It features secure user authentication (including Google OAuth), real-time product management, and a streamlined checkout process integrated with the **Khalti Payment Gateway**.

## Core Features

*   **Authentication:** User registration, login, and Google OAuth sign-in.
*   **Shopping:** Product browsing, persistent shopping cart, and order history.
*   **Payments:** Secure checkout via Khalti payment gateway.
*   **Admin Tools:** Complete CRUD operations for products, stock control, and user/order management.

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js (Redux, React Router DOM) |
| **Backend** | Node.js / Express.js (Mongoose, JWT) |

## Setup & Run Locally

### Prerequisites
*   Node.js (v16+)
*   npm
*   MongoDB instance (local or Atlas)

### Installation

1.  **Clone:** `git clone https://github.com/alvert-git/MERN-Ecommerce.git`
2.  **Install Dependencies:** Run `npm install` in both the `/backend` and `/frontend` directories.
3.  **Configure:** Create and populate the `.env` file in the `/backend` directory with your `MONGO_URI`, `JWT_SECRET`, and payment/auth keys (Khalti, Google OAuth).

### Launch

1.  **Start Backend:** `cd backend && npm run dev`
2.  **Start Frontend:** `cd frontend && npm start`

### Screenshots
<img width="479" height="1179" alt="Untitled design" src="https://github.com/user-attachments/assets/033a0468-553a-454d-b0ca-11f44d4f0e1f" /><br/>
<img width="609" height="668" alt="image" src="https://github.com/user-attachments/assets/2b991b8b-0076-4f94-9959-dcd8fc3c6f8c" /><br/>
<img width="1900" height="878" alt="image" src="https://github.com/user-attachments/assets/ec144e2a-0106-4005-9a51-0d65cd607c43" /><br/>
<img width="1163" height="729" alt="image" src="https://github.com/user-attachments/assets/bba98b66-cfca-4389-9794-6e650b58a434" /><br/>
<img width="1805" height="824" alt="image" src="https://github.com/user-attachments/assets/ede475e7-62db-45b1-b665-4267a3b3c5d7" /><br/>
<img width="1898" height="712" alt="image" src="https://github.com/user-attachments/assets/bc83c622-6fec-4ebf-b794-6d95387cbeb0" /><br/>




## 📄 License

This project is licensed under the **MIT License**.
