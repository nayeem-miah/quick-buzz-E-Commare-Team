# Quick Buzz - Multi-Vendor E-Commerce Platform

Quick Buzz is a production-ready, highly scalable, and secure multi-vendor e-commerce platform custom-tailored for the Bangladeshi market. The system features a modern, responsive user experience on the frontend, supported by a decoupled Node.js and Express backend. It incorporates robust role-based access controls, automated escrow-based wallet management for sellers, secure online payment gateway integration, and real-time operational logging.

---

## Live Deployment & Documentation

* **Production URL:** [https://quick-bus-bd.web.app/](https://quick-bus-bd.web.app/)
* **Project Requirements Document:** [Google Docs Link](https://docs.google.com/document/d/1ECbEbhd9BmR36V8r3F4qftZU2NgNh2Du-W_G-LHBJxU/edit?usp=sharing)

---

## Core Architecture & System Features

The platform is designed around three primary user archetypes, each with customized workflows and access levels.

### 1. Buyer (Customer) Workflow
* **Identity & Access Management:** Secure sign-up, sign-in, and OAuth 2.0 Google Social Login handled via Firebase Authentication.
* **Search & Discovery:** High-speed product searches, multi-level category navigation, and dynamically applied filtration logic.
* **Stateful Shopping Cart:** Persistent frontend cart management synchronized with client sessions and server-side verification.
* **Unified Checkout & Payments:** Secure payment processing integrated with **SSLCommerz** (supporting local credit/debit cards, bKash, Nagad, Rocket) and a Cash on Delivery (COD) option.
* **Real-time Order Lifecycle:** Interactive visual tracking showing transition stages (`Pending` -> `Processing` -> `Shipped` -> `Delivered`) along with transactional history.
* **Automated Notifications:** In-app notification feeds and server-triggered email alerts for transaction receipts and shipping updates.

### 2. Vendor (Host) Portal
* **Inventory Management:** Full CRUD operations for product catalogs with automated cloud-based image storage and processing via Cloudinary.
* **Order & Dispatch Control:** Vendor interface for approving cash-on-delivery orders, updating transit status, and appending courier tracking links.
* **Financial Ledger (Escrow Wallet System):**
  * `Pending Balance`: Funds held securely in escrow upon purchase.
  * `Available Balance`: Funds released to the vendor's wallet only after successful delivery is verified by the Administrator.
* **Analytical Insights:** Interactive dashboards displaying historical sales statistics, order volume, and revenue metrics.

### 3. Administrative Control Plane
* **Platform Insights:** Consolidated dashboard presenting system metrics, order history, active users, and system health charts.
* **Governance and Security:** Complete user administration allowing administrators to manage roles, verify identities, and suspend or restore accounts.
* **Host Verification:** Pipeline to review, approve, or reject merchant onboarding applications.
* **Transaction Clearance:** Review of delivery verification, manual clearance of escrow funds to vendor accounts, and processing cancellations/refunds.
* **Audit Trail & System Logs:** Complete database-backed operational logging tracking state changes, roles, and administrative interventions.

### 4. QuickBuzz AI Shopping Assistant (Chatbot)
* **Interactive Floating UI:** Styled, floating interactive chat window with smooth micro-animations and custom styling.
* **Google Gemini AI Integration:** Leverages the Google Gemini REST API (`gemini-flash-latest` model) for low-latency contextual product suggestions.
* **Database-Driven Recommendations:** Queries active, approved catalog listings from MongoDB to generate tailored suggestions.
* **Inline Product Linking:** Custom markdown parser automatically converts product recommendation IDs to interactive React Router links inside the chat bubble.
* **State Persistence & History Control:** Automatically saves conversation state in `localStorage` across page navigation and includes a custom modal to clear chat history.

---

## Technology Stack

### Frontend Architecture
* **Framework:** React.js bootstrapped with Vite for optimized hot module replacement (HMR) and fast builds.
* **Language:** TypeScript for compile-time safety and type enforcement.
* **Data Fetching & State:** React Query (`@tanstack/react-query`) for declarative server-state management, query caching, and optimistic UI updates.
* **Styling & UI:** TailwindCSS alongside custom CSS utilities, Swiper.js for slide interaction, and AOS for micro-animations.
* **Routing:** React Router DOM configured with declarative route guards for private, host-only, and admin-only subtrees.
* **Visualizations:** ApexCharts and Chart.js for rendering operational telemetry on dashboards.

### Backend Infrastructure
* **Runtime Environment:** Node.js with Express.js for building scalable RESTful APIs.
* **Authentication Security:** JSON Web Token (JWT) verification combined with Firebase Admin SDK token validation for secure route access.
* **Media Pipelines:** Multer-backed multipart form parsing coupled with the Cloudinary SDK for real-time asset optimization and hosting.
* **Mailing Service:** Nodemailer SMTP configuration for automated email dispatches.
* **Database Connection:** MongoDB Official Native Client for low-overhead database interactions.

### Database Design
* **Engine:** MongoDB (NoSQL) for document-based, highly flexible storage schemas.

---

## Project Structure

```text
Quick-Buzz/
 ├── client/         # Frontend React + TypeScript application
 ├── server/         # Backend Node.js + Express.js API server
 ├── README.md       # Platform documentation
 └── ...
```

---

## Installation & Configuration

### Prerequisites
* Node.js (v18 or higher recommended)
* MongoDB database instance
* Cloudinary, SSLCommerz, and Firebase developer accounts

### 1. Backend Service Configuration
1. Navigate to the server folder and install dependencies:
   ```bash
   cd server
   npm install
   ```
2. Create a `.env` file in the root of the `server/` directory and configure the environment variables as follows:
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_uri
   JWT_SECRET=your_jwt_signing_secret

   # SSLCommerz Integration
   STORE_ID=your_ssl_store_id
   STORE_PASS=your_ssl_store_pass

   # Asset Storage (Cloudinary)
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret

   # Mail Notification Engine
   EMAIL_USER=your_nodemailer_email_username
   EMAIL_PASS=your_nodemailer_email_app_password

   # Google Gemini AI Integration
   GEMINI_API_KEY=your_gemini_api_key_from_google_ai_studio
   ```
3. Boot up the local development server:
   ```bash
   npm run dev
   ```

### 2. Frontend Application Setup
1. Navigate to the client folder and install dependencies:
   ```bash
   cd client
   npm install
   ```
2. Place your Firebase client credentials inside `client/src/firebase/firebase.config.ts`.
3. Launch the Vite development server:
   ```bash
   npm run dev
   ```

---

## Seed & Demo Credentials

To evaluate the platform, use the pre-configured credentials below:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Administrator** | `quick.buzz@gmail.com` | `123456` |
| **Merchant / Host** | `host.quickbuzz@gmail.com` | `123456` |
| **Customer / Buyer** | `user.quickbuzz@gmail.com` | `123456` |

---

## Development Team

* **MD Nayeem Miah**
  * *Role:* Full Stack Developer (SM TECHNOLOGY)
  * *Email:* [nayeem5113@gmail.com](mailto:nayeem5113@gmail.com)
  * *LinkedIn:* [MD Nayeem Miah](https://www.linkedin.com/in/md-nayeem-miah-734719307/)
  * *Portfolio:* [nayeem-miah.vercel.app](https://nayeem-miah.vercel.app/)

* **Rakibul Hasan**
  * *Role:* Full Stack Developer
  * *Email:* [rakibulhasan3929@gmail.com](mailto:rakibulhasan3929@gmail.com)
  * *LinkedIn:* [Rakibul Hasan](https://www.linkedin.com/in/rakibul-hasan-b94123271/)
  * *Portfolio:* [rakibportfolio.com](https://rakibportfolio.com/)

---

## Contributing

We welcome contributions to optimize the platform. Please adhere to the following workflow:
1. Fork the repository and create your feature branch: `git checkout -b feature/AmazingFeature`.
2. Commit your changes: `git commit -m 'feat: add amazing feature'`.
3. Push to the branch: `git push origin feature/AmazingFeature`.
4. Open a Pull Request for code review.

---

## License

This project is distributed under the MIT License. See `LICENSE` for details.
