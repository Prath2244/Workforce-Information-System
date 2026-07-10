# 🧑‍💼 Nexus HRMS – Enterprise Human Resource Management System

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue?style=flat-square&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb)](https://mongodb.com/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4.x-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

> A full‑featured HRMS (Human Resource Management System) built with the MERN stack + TypeScript, featuring Role‑Based Access Control, leave management, payroll automation, and PDF payslip generation.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Installation & Setup](#-installation--setup)
- [Running the Application](#-running-the-application)
- [API Endpoints (v1)](#-api-endpoints-v1)
- [Screenshots](#-screenshots)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🧾 Overview

**Nexus HRMS** is a secure, scalable, and user‑friendly platform designed to streamline human resource operations. It empowers administrators and HR managers to handle employee onboarding, leave requests, payroll processing, and automated payslip generation – all within a single, modern web application.

Employees can view their colleagues, request time off, and access their own payslips, while HR/Admin have full control over employee records, leave approvals, and payroll adjustments.

---

## ✨ Features

### 👑 Admin / HR
- **Dashboard** – Overview of total employees, departments, and pending leaves.
- **Employee Management** – Add, edit, delete employees (full CRUD) with an intuitive multi‑step wizard.
- **Leave Management** – View all leave requests, accept or reject with a single click.
- **Payroll Management** – Create, update, delete payroll records; adjust salary bonuses/deductions (-100% to +100%).
- **PDF Payslip** – Automatically generate and download a formatted payslip for any employee.
- **Secure RBAC** – Middleware ensures only authorised roles can access sensitive endpoints.

### 👥 Employee
- **Dashboard** – View organisation‑wide statistics (read‑only).
- **Employee Directory** – Browse colleagues with basic info (name, email, department, role).
- **Leave Requests** – Submit leave requests and track their status (pending, approved, rejected).
- **Payroll** – View personal payroll details and download PDF payslip.

---

## 🛠️ Tech Stack

| Category       | Technology                                                  |
|----------------|-------------------------------------------------------------|
| Backend        | Node.js, Express.js, TypeScript                             |
| Database       | MongoDB Atlas (NoSQL) with Mongoose ODM                    |
| Authentication | JWT, bcrypt password hashing, Helmet, rate‑limiting        |
| Frontend       | React 19, Vite, TypeScript                                 |
| Styling        | Tailwind CSS v4 (via Vite plugin)                          |
| State Management | React Query (server‑state caching)                        |
| PDF Generation | PDFKit (server‑side)                                       |
| Containerisation| Docker & Docker Compose (optional)                        |
| CI/CD          | GitHub Actions (ready for pipeline)                        |

---

## 🧱 Architecture

- **Backend** – RESTful API with Express, split into controllers, models, routes, and middleware.  
- **Frontend** – Single‑page React application with lazy loading, reusable components, and a clean dashboard layout.  
- **Security** – JWT stored in `localStorage`; every request is validated with role‑based middleware.  
- **Database** – MongoDB collections: `users`, `employees`, `leaves`, `payrolls`.  
- **PDF Generation** – Triggered by a GET request, generates a ready‑to‑download PDF using `pdfkit`.

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v20 or later)
- npm or yarn
- MongoDB Atlas account (or local MongoDB instance)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/hrms-project.git
cd hrms-project
