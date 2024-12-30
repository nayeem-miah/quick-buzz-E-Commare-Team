# Quick Buzz: E-Commerce Website for Bangladesh

![QuickBuzz](https://i.ibb.co/mRKfM4m/quickbuzz.png)

## Project Overview

This is a comprehensive e-commerce platform tailored for the Bangladeshi market, developed using modern technologies to ensure scalability, security, and a seamless user experience.

### Live Website

[Quick Buzz BD](https://quick-bus-bd.web.app/)

### Website Requirements

[Quick Buzz BD Website Requirements](https://docs.google.com/document/d/1ECbEbhd9BmR36V8r3F4qftZU2NgNh2Du-W_G-LHBJxU/edit?usp=sharing)

## Developers

<div style="display: flex; flex-wrap: wrap; gap: 40px; justify-content: space-between; font-family: Arial, sans-serif;">

### Nayeem Miah

<div style="flex: 1 1 300px; text-align: center; box-sizing: border-box; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
  <img src="https://i.ibb.co/j4K0VZz/nayeem.jpg" alt="Nayeem" width="120" height="120" style="border-radius: 50%; margin-bottom: 15px; border: 3px solid #ddd;">
  <h3 style="color: #333;">Nayeem Miah</h3>
  <p><strong>Role:</strong> MERN Stack Developer</p>
  <p><strong>Education:</strong> Student at Moulvibazar Polytechnic Institute, CST Department</p>
  <p><strong>Email:</strong> <a href="mailto:nayeem5113@gmail.com" style="color: #0073e6;">nayeem5113@gmail.com</a></p>
  <p><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/md-nayeem-miah-734719307/" target="_blank" style="color: #0073e6;">linkedin.com/in/nayeem</a></p>
  <p><strong>Website:</strong> <a href="https://nayeemportfolio-70.web.app/" target="_blank" style="color: #0073e6;">nayeemportfolio-70.web.app</a></p>
</div>

### Rakibul Hasan

<div style="flex: 1 1 300px; text-align: center; box-sizing: border-box; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
  <img src="https://i.ibb.co/gdVjqQD/rakib.jpg" alt="Rakib" width="120" height="120" style="border-radius: 50%; margin-bottom: 15px; border: 3px solid #ddd;">
  <h3 style="color: #333;">Rakibul Hasan</h3>
  <p><strong>Role:</strong> MERN Stack Developer</p>
  <p><strong>Education:</strong> Student at Moulvibazar Polytechnic Institute, CST Department</p>
  <p><strong>Email:</strong> <a href="mailto:rakibulhasan3929@gmail.com" style="color: #0073e6;">rakibulhasan3929@gmail.com</a></p>
  <p><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/rakibul-hasan-b94123271/" target="_blank" style="color: #0073e6;">linkedin.com/in/rakib</a></p>
  <p><strong>Website:</strong> <a href="https://rakibportfolio.com/" target="_blank" style="color: #0073e6;">rakibportfolio.com</a></p>
</div>
</div>

## Features

### User Features

- **Authentication**: Sign up/login using email, phone, or Google via Firebase Authentication.
- **Product Search and Filters**: Search by category, price, brand, and ratings with real-time suggestions.
- **Shopping Cart**: Persistent cart stored in Firebase for logged-in users and localStorage for guests.
- **Order Tracking**: Real-time updates on order status via Firebase.

### Vendor Features

- **Dashboard**: Manage products (add, edit, delete) and view sales data.
- **Registration/Login**: Vendor authentication using Firebase.

### Admin Features

- **Dashboard**: Manage users, vendors, and products. Approve/reject vendor applications.
- **Order Management**: Handle refunds, cancellations, and disputes.

## Tech Stack

- **Frontend**: React.js, TailwindCSS, TypeScript.
- **Backend**: Node.js, Express.js, TypeScript.
- **Database**: MongoDB (NoSQL).
- **Authentication**: Firebase Authentication.
- **Payment Gateway**: SSLCommerz (bKash, Nagad, Rocket, credit/debit cards).
- **Other Tools**: Axios, Mongoose, JSON Web Tokens (JWT), Multer for file uploads.

## Pages

- **Home**: Promotional banners and featured products.
- **Product Categories**: Filter by price, brand, ratings.
- **Cart**: Overview of selected items, total price, and checkout.
- **Checkout**: Input shipping details and payment via SSLCommerz.
- **User Dashboard**: Order history and account updates.
- **Vendor Dashboard**: Product and sales management.
- **Admin Dashboard**: Manage site-wide settings.

## Installation and Setup

### Prerequisites

- Node.js and npm installed on your system.
- MongoDB instance running.

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/backend-repo.git
   ```
2. Navigate to the backend directory:
   ```bash
   cd backend-repo
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables in a `.env` file:
   ```
   MONGO_URI=<Your MongoDB URI>
   JWT_SECRET=<Your JWT Secret>
   FIREBASE_CONFIG=<Firebase Configuration JSON>
   ```
5. Start the backend server:
   ```bash
   nodemon index.js
   ```

### Frontend Setup

1. Clone the frontend repository:
   ```bash
   git clone https://github.com/yourusername/frontend-repo.git
   ```
2. Navigate to the frontend directory:
   ```bash
   cd frontend-repo
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the frontend application:
   ```bash
   npm run dev
   ```

## Contribution Guidelines

1. Fork the repository.
2. Create a new branch for your feature/fix.
3. Commit your changes with descriptive messages.
4. Submit a pull request for review.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more information.

---

For any inquiries or issues, please contact us at the provided developer emails.
