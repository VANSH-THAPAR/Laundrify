# 🧺 Laundrify - Hostel Laundry Management System

Laundrify is a modern, full-stack web application built to eliminate the chaos of hostel laundry management. It provides students with a **seamless digital platform** to submit, track, and manage their laundry, removing the hassle of paper slips and reducing the chances of losing clothes.

Now available as a **Dockerized setup** — so you can run both frontend and backend instantly using Docker Compose!

---

## ✨ Features

* 📱 **Digital Laundry Slips** – Simple, intuitive form to digitally add clothes. No more paper slips!
* 🤝 **Smart Roommate Sync** – Automatically merges laundry slips from all roommates into a master list for the room.
* 📊 **Live Dashboard** – Real-time overview of all submissions with a combined summary of items.
* ✏️ **Inline Editing & Deletion** – Edit quantities or delete entries directly from the dashboard.
* 🔐 **Secure Authentication** – Login/Signup powered by JWT for complete data security.
* 📱 **Responsive Design** – Premium UI/UX optimized for desktop and mobile.
* 🐳 **Docker Support** – Run the full app stack (frontend, backend, and MongoDB) with one command.
* 🌐 **Fully Responsive Website** – Works smoothly across desktops, tablets, and mobile devices.

---

## 🛠️ Tech Stack

| Category     | Technology                               |
| ------------- | ---------------------------------------- |
| **Frontend**  | React, React Router, Tailwind CSS, Axios |
| **Backend**   | Node.js, Express.js                      |
| **Database**  | MongoDB with Mongoose                    |
| **Auth**      | JWT (JSON Web Tokens), bcrypt.js         |
| **DevOps**    | Docker, Docker Compose                   |

---

## 🚀 Getting Started

You can set up **Laundrify** in two ways:

1. 🧩 **Traditional Setup (Node + npm)**  
2. 🐳 **Docker Setup (Recommended for developers)**

---

## 🐳 Option 1 — Run with Docker (Recommended)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) or Docker Engine + Docker Compose plugin installed.

### Steps

```bash
# 1️⃣ Clone the repository
git clone https://github.com/VANSH-THAPAR/Laundrify.git
cd Laundrify

# 2️⃣ Build and start all services
docker compose up --build
