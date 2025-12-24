# Graduate Thesis System (GTS)

https://github.com/user-attachments/assets/0b3ae559-1018-4acd-a4a8-7f5256a5ae70

Graduate Thesis System (GTS) is a full-stack web application designed to manage graduate thesis records in a structured and reliable manner.  
The system enables universities to manage master data (universities, institutes, people, subject topics) and to handle thesis submission, search, and detailed thesis viewing operations based on a relational database design.

This project was developed as part of the **SE 307 – Database Management Systems** course at **Maltepe University**.

---

## Project Information

- **Project Title:** Graduate Thesis System (GTS)
- **Course Code:** SE 307 01  
- **Course Name:** Database Management Systems  
- **Instructor:** Dr. Öğr. Üyesi Volkan TUNALI  
- **University:** Maltepe University  
- **Department:** Software Engineering (English)  

**Student Information**
- **Name:** Hasan Muayad Adnan Alsaedi  
- **Student ID:** 220706802  

---

## Project Overview

The Graduate Thesis System (GTS) is designed to store, manage, and query graduate thesis information using a normalized relational database.  
The system supports:

- Management of universities, institutes, people, and subject topics
- Submission of graduate theses with mandatory and optional relationships
- Multi-criteria thesis search functionality
- Viewing detailed thesis information
- Dashboard statistics based on database content

The project emphasizes correct application of database design principles such as normalization, referential integrity, and transactional consistency, and demonstrates how these concepts can be integrated into a real-world web application.

---

## Technologies Used

### Frontend
- React
- TypeScript
- Vite
- React Router DOM
- Tailwind CSS
- React Hook Form
- Zod
- date-fns

### Backend
- Node.js
- Express
- TypeScript
- MySQL
- MySQL2
- Zod
- dotenv
- CORS

### Database
- MySQL (Relational Database Management System)

---

## Project Structure

graduate-thesis-system/
│
├── backend/
│ ├── src/
│ │ ├── config/
│ │ ├── controllers/
│ │ ├── middleware/
│ │ ├── routes/
│ │ ├── services/
│ │ ├── validators/
│ │ └── index.ts
│ ├── package.json
│ └── tsconfig.json
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── services/
│ │ ├── types/
│ │ └── App.tsx
│ ├── package.json
│ └── vite.config.ts
│
└── README.md

The frontend and backend are intentionally separated to maintain a clean layered architecture and separation of concerns.

---

## System Architecture

The application follows a three-tier architecture:

Frontend (React + TypeScript)
|
| REST API (JSON)
v
Backend (Node.js + Express)
|
| SQL Queries / Transactions
v
MySQL Relational Database

- The frontend handles user interaction and presentation.
- The backend enforces business rules and manages database operations.
- The database serves as the single source of truth.

---

## Key Features

- **Master Data Management:** CRUD operations for universities, institutes, people, and subject topics
- **Thesis Management:** Thesis submission, update, deletion, and viewing
- **Relational Data Handling:** Supervisor assignments, subject topics, and keywords
- **Advanced Search:** Multi-criteria thesis search with filtering
- **Dashboard:** Statistical overview of system data
- **Validation:** Client-side and server-side validation using Zod
- **Transactions:** Atomic database operations for complex workflows

---

## Database Design

The database schema was designed according to the project requirements and normalized to 3NF.  
Key tables include:

- University
- Institute
- Person
- Thesis
- SupervisorAssignment
- SubjectTopic
- Thesis_SubjectTopic
- Keyword
- Thesis_Keyword

All relationships are enforced using primary keys, foreign keys, and controlled constraints.

---

## How to Run the Project Locally

### Prerequisites
- Node.js (v18 or later recommended)
- MySQL Server
- npm

---

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:3007`

Configure database connection using environment variables:  
Create a `.env` file in the backend directory:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

The frontend communicates with the backend via REST API.

### Notes

- Environment files (`.env`) are intentionally excluded from version control.
- A `.env.example` file can be used as a reference for configuration.
- The project is developed for academic purposes as part of SE 307.

---

## Course Context

This project was developed individually as a term project for the **SE 307 – Database Management Systems** course.  
It demonstrates the practical application of database design principles taught during the course by integrating them into a functional web-based system.
