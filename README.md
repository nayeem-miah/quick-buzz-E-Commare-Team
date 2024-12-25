# quick-buzz: E-Commerce Website for Bangladesh

## Project Overview
This is a comprehensive e-commerce platform tailored for the Bangladeshi market, developed using modern technologies to ensure scalability, security, and a seamless user experience.

### Live Website
[Quick Buzz BD](https://quick-bus-bd.web.app/)

## Developers

### Nayeem
- **Role**: MERN Stack Developer  
- **Education**: Student at Moulvibazar Polytechnic Institute, CST Department  
- **Email**: nayeem5113@gmail.com  
- **LinkedIn**: [linkedin.com/in/nayeem](https://www.linkedin.com/in/md-nayeem-miah-734719307/)  
- **Website**: [nayeem](https://nayeemportfolio-70.web.app/)

### Rakib
- **Role**: MERN Stack Developer  
- **Education**: Student at Moulvibazar Polytechnic Institute, CST Department  
- **Email**: rakibulhasan3929@gmail.com  
- **LinkedIn**: [linkedin.com/in/rakib](https://www.linkedin.com/in/rakibul-hasan-b94123271/)  
- **Website**: [rakib](https://rakibportfolio.com/)

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
   npm run dev
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
   npm start
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
