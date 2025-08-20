# 🧺 Laundrify - Hostel Laundry Management System

Laundrify is a modern, full-stack web application built to eliminate the chaos of hostel laundry management. It provides students with a **seamless digital platform** to submit, track, and manage their laundry, removing the hassle of paper slips and reducing the chances of losing clothes.

---

## ✨ Features

* 📱 **Digital Laundry Slips** – Simple, intuitive form to digitally add clothes. No more paper slips!
* 🤝 **Smart Roommate Sync** – Automatically merges laundry slips from all roommates into a master list for the room.
* 📊 **Live Dashboard** – Real-time overview of all submissions with a combined summary of items.
* ✏️ **Inline Editing & Deletion** – Edit quantities or delete entries directly from the dashboard.
* 🔐 **Secure Authentication** – Login/Signup powered by JWT for complete data security.
* 📱 **Responsive Design** – Premium UI/UX optimized for desktop and mobile.
* 🌐 **Fully Responsive Website** – Works smoothly across desktops, tablets, and mobile devices.

---

## 🛠️ Tech Stack

| Category     | Technology                               |
| ------------ | ---------------------------------------- |
| **Frontend** | React, React Router, Tailwind CSS, Axios |
| **Backend**  | Node.js, Express.js                      |
| **Database** | MongoDB with Mongoose                    |
| **Auth**     | JWT (JSON Web Tokens), bcrypt.js         |

---

## 🚀 Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) and npm (or yarn)
* [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or a local MongoDB instance

### 1️⃣ Backend Setup

```bash
# Clone the repository
git clone https://github.com/VANSH-THAPAR/Laundrify

# Navigate to backend
cd Laundrify/backend

# Install dependencies
npm install

# Create .env file
touch .env
```

Your **backend/.env** file should include:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
FRONTEND_URL=http://localhost:5173
```

Start the backend server:

```bash
npm run dev
```

### 2️⃣ Frontend Setup

```bash
# Navigate to frontend
cd ../frontend

# Install dependencies
npm install

# Create .env file
touch .env
```

Your **frontend/.env** file should include:

```env
VITE_BACKEND_URL=http://localhost:3000
```

Start the frontend server:

```bash
npm run dev
```

Now the app will be running at:

* Frontend → `http://localhost:5173`
* Backend → `http://localhost:3000`

---

## 📄 API Endpoints

### Auth

* `POST /handlesignup` → Register a new user
* `POST /handlelogin` → Login existing user

### Laundry

* `POST /handlelaundary` → Submit a new laundry slip
* `GET /displayLaundary` → Get all slips for a date
---

## 🌐 Deployment

The application is deployed at: [Laundrify Live](https://laundrify-vansh.netlify.app/)

---


## 🤝 Contributing

Contributions are always welcome!

1. Fork the repo
2. Create a new branch (`feature/new-feature`)
3. Commit changes
4. Open a Pull Request

---
