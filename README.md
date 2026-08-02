# **Quick Buzz – Modern E-Commerce Platform for Bangladesh**

A scalable, secure, and high-performance multi-vendor e-commerce platform designed for the Bangladeshi market. Built with modern web technologies, this project provides a seamless shopping experience for customers, alongside robust dashboards and wallet management for sellers (hosts) and administrators.

![QuickBuzz](https://i.ibb.co/mRKfM4m/quickbuzz.png)

---

## 🚀 **Live Deployment**

*   🌐 **Live Website:** [https://quick-bus-bd.web.app/](https://quick-bus-bd.web.app/)
*   📄 **Project Requirements Document:** [Google Docs Link](https://docs.google.com/document/d/1ECbEbhd9BmR36V8r3F4qftZU2NgNh2Du-W_G-LHBJxU/edit?usp=sharing)

---

# ⭐ **Core Platform Features**

### 👤 **Customer (Buyer) Features**
*   **Authentication:** Email/Password and Google Social Login powered by **Firebase Authentication**.
*   **Search & Filtering:** Advanced real-time search, multi-category browsing, and dynamic filter parameters.
*   **Cart & Checkout:** Persistent shopping cart system, dynamic delivery charges, and checkout flow.
*   **Payments:** Secure online payments through **SSLCommerz** (supporting Credit/Debit cards, bKash, Nagad, Rocket) and **Cash on Delivery (COD)**.
*   **Order Tracking:** Beautiful step-by-step timeline tracking order progress (Pending ➔ Processing ➔ Shipped ➔ Delivered) and cancellations.
*   **Notifications:** Real-time in-app notifications and automated emails for order confirmation, payment success, and status changes.

### 🛍️ **Seller (Host) Features**
*   **Vendor Dashboard:** Complete inventory management (Add, Edit, and Delete products) with Cloudinary image upload.
*   **Order Management:** Approve incoming COD orders and transition them to processing.
*   **Shipment Tracking:** Ability to add Courier/Tracking details to ship products.
*   **Financial Wallet:** Escrow wallet tracking:
    *   `pending_balance`: Balance held in escrow until delivery is verified.
    *   `available_balance`: Settled balance released after successful delivery, ready for payout.
*   **Sales Analytics:** Interactive charts showcasing sales statistics, orders, and revenue.

### 🛡️ **Admin Features**
*   **Admin Control Center:** Global insights with key metrics cards and interactive analytics charts.
*   **User Management:** Manage, assign roles, block/unblock, and review all customers and sellers.
*   **Seller Verification:** Approve or decline seller host requests.
*   **Order & Escrow Control:** Review overall order statuses, mark items as delivered (releasing escrow funds to sellers), and cancel orders when needed.
*   **Real-time Activity Logs:** Detailed history of order changes tracking actions by user and role.

---

# 🛠️ **Tech Stack**

### **Frontend**
*   **Core:** React.js, Vite, TypeScript
*   **State & Query Management:** React Query (`@tanstack/react-query`), Context API
*   **Styling:** TailwindCSS, Custom CSS, Swiper (Carousels), AOS (Animate on Scroll)
*   **Routing:** React Router Dom (with Private & Role-Protected routes)
*   **UI Components:** React Icons, Lucide Icons, SweetAlert2, React Hot Toast
*   **Charts:** ApexCharts, Chart.js

### **Backend**
*   **Runtime:** Node.js, Express.js (JavaScript)
*   **Security & Auth:** JSON Web Tokens (JWT) for secure API endpoints, Firebase Admin SDK
*   **Media Handling:** Cloudinary API for high-performance image uploads and storage, Multer (multipart form handling)
*   **Email Engine:** Nodemailer for automated notifications
*   **Database Client:** MongoDB Official Native Client

### **Database**
*   **Storage:** MongoDB (NoSQL)

---

# 📦 **Project Structure**

```text
Quick-Buzz/
 ├── client/         # Frontend React + TypeScript application
 ├── server/         # Backend Node.js + Express.js API server
 ├── README.md       # Project documentation
 └── ...
```

---

# ⚙️ **Installation & Configuration**

### **1. Server/Backend Setup**

Clone the repository and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the `server` root directory:
```env
PORT=3000
MONGO_URI=your_mongodb_connection_uri
JWT_SECRET=your_jwt_signing_secret

# SSLCommerz Configuration
STORE_ID=your_ssl_store_id
STORE_PASS=your_ssl_store_pass

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Configuration
EMAIL_USER=your_nodemailer_email_username
EMAIL_PASS=your_nodemailer_email_app_password
```

Start the backend server in development mode:
```bash
npm run dev
```

---

### **2. Client/Frontend Setup**

Navigate to the client directory and install dependencies:
```bash
cd client
npm install
```

Configure Firebase by adding/editing your credentials file at `client/src/firebase/firebase.config.ts`.

Start the frontend Vite development server:
```bash
npm run dev
```

---

# 🧪 **Demo Credentials**

| Role  | Email | Password |
| ----- | ----- | -------- |
| **Admin** | `quick.buzz@gmail.com` | `123456` |
| **Host (Seller)** | `host.quickbuzz@gmail.com` | `123456` |
| **User (Customer)** | `user.quickbuzz@gmail.com` | `123456` |

---

# 👨‍💻 **Developers**

### **🟦 MD Nayeem Miah**
*   **Role:** Full Stack Developer at <SM TECHNOLOGY>
*   📧 **Email:** [nayeem5113@gmail.com](mailto:nayeem5113@gmail.com)
*   🔗 **LinkedIn:** [MD Nayeem Miah](https://www.linkedin.com/in/md-nayeem-miah-734719307/)
*   🌐 **Portfolio:** [nayeem-miah.vercel.app](https://nayeem-miah.vercel.app/)

### **🟩 Rakibul Hasan**
*   **Role:** Full Stack Developer
*   **Institution:** CST, Moulvibazar Polytechnic Institute
*   *   📧 **Email:** [rakibulhasan3929@gmail.com](mailto:rakibulhasan3929@gmail.com)
    *   🔗 **LinkedIn:** [Rakibul Hasan](https://www.linkedin.com/in/rakibul-hasan-b94123271/)
    *   🌐 **Portfolio:** [rakibportfolio.com](https://rakibportfolio.com/)

---

# 🤝 **Contributing**

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/NewFeature`).
3. Commit your changes with clear messages (`git commit -m 'Add NewFeature'`).
4. Push to the branch (`git push origin feature/NewFeature`).
5. Open a Pull Request.

---

# 📄 **License**

This project is licensed under the **MIT License**.
