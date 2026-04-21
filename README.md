# TaskNest – Student, Group & Assignment Management System

> [!CAUTION]
> **This project is under active development.** More features, continuous optimizations, and architectural improvements will be made over time.

## 📌 Project Overview
TaskNest is an institutional-grade academic management platform designed to streamline student collaboration, assignment tracking, and faculty evaluation. It serves as a centralized hub for managing coursework, coordinating group formations, and providing transparent, real-time feedback on academic deliverables. 

The system operates on a robust role-based architecture:
- **Faculty:** Can broadcast assignments, manage institutional nodes (classrooms), oversee student formations (groups), and evaluate submissions.
- **Student:** Can join groups, track critical deadlines, submit individual or group assignments, and monitor their academic performance.

---

## 🚀 Implementation Overview
TaskNest is built with a strict separation of concerns, ensuring scalability and maintainability.
- **Role-Based Access Control:** Secure JWT-based routing ensures Students and Faculty can only access authorized modules.
- **Assignment Lifecycle:** A seamless workflow from creation by Faculty, assignment to specific nodes or global availability, submission by Students (individually or as a group), and final evaluation/grading by Faculty.
- **Real-Time Data Flow:** React state management combined with optimized RESTful endpoints ensures instant synchronization of submissions, grades, and deadlines across all user dashboards.

---

## 🏗️ Architecture Overview

TaskNest utilizes a modern, decoupled architecture:

**Frontend:**
- **React.js (Vite):** Provides lightning-fast compilation and highly responsive UI rendering.
- **Tailwind CSS:** Powers the customized, premium "Ice Blue" aesthetic for modern, accessible UI components.

**Backend:**
- **Node.js + Express:** A lightweight, scalable backend that securely handles business logic, authentication, and REST API routing.

**Database:**
- **PostgreSQL:** A powerful relational database ensuring ACID compliance for structured academic data.

**Data Flow:**
- **Frontend → Backend:** The React client communicates with the Express backend via REST API calls (`fetch`), securely transmitting JWT tokens in the `Authorization` headers.
- **Backend → Database:** The Express controllers use parameterized SQL queries (`pg` pool) to interact with PostgreSQL, preventing SQL injection and ensuring data integrity.

---

## 🗄️ Database Schema & Relationships

The PostgreSQL database is structured to handle complex academic hierarchies.

### Key Tables
- `users`: Stores all authenticating entities (Students and Faculty) along with their hashed credentials and roles.
- `assignments`: Contains details for all academic objectives, deadlines, and assignment types (individual/group).
- `submissions`: Tracks all assignment submissions, linking files, timestamps, status, and faculty grades.
- `groups`: Manages student formations.
- `classrooms`: Represents institutional nodes (courses/classes).
- `notes`: Stores resources and study materials uploaded by Faculty.

### Core Relationships
- **Student ↔ Assignments:** Handled via the `submissions` table or through targeting tables (`assignment_targets`).
- **Group ↔ Submissions:** A unified submission record is linked to a `group_id` for collaborative assignments.
- **Classroom ↔ Students:** The `classroom_members` linking table associates multiple students with their respective institutional nodes.

*(Note: The system acts via a relational Entity-Relationship (ER) model where foreign keys strictly enforce data integrity across all entities.)*

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `POST` | `/api/auth/register` | Register a new system entity (Student/Faculty). |
| `POST` | `/api/auth/login` | Authenticate and retrieve secure JWT session token. |
| `GET` | `/api/assignments` | Retrieve academic objectives based on role visibility. |
| `POST` | `/api/assignments` | (Faculty) Broadcast a new assignment to the network. |
| `GET` | `/api/submissions` | Retrieve submission records and grading feedback. |
| `POST` | `/api/submissions` | (Student) Submit a completed assignment deliverable. |
| `PUT` | `/api/submissions/evaluate/:id` | (Faculty) Grade and provide feedback on a submission. |
| `GET` | `/api/notes` | Fetch institutional resources and notes. |
| `POST` | `/api/exams` | (Faculty) Schedule high-stakes academic examinations. |

---

## ⚙️ Setup & Run Instructions

Follow these steps to initialize the development environment:

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd TaskNest
   ```
2. **Install dependencies:**
   ```bash
   npm install
   cd frontend && npm install
   cd ../backend && npm install
   cd ..
   ```
3. **Install PostgreSQL:** Ensure PostgreSQL is installed and running on your host machine.
4. **Create database:**
   ```sql
   CREATE DATABASE crm_db;
   ```
5. **Run init.sql:** Execute the schema file in the `backend/config/` directory to construct tables.
   ```bash
   psql -U postgres -d crm_db -f backend/config/init.sql
   ```
6. **Configure .env:**
   Create a `.env` file in the `/backend` directory:
   ```env
   PORT=5001
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=crm_db
   DB_PASS=your_password
   DB_PORT=5432
   JWT_SECRET=your_super_secret_key
   ```
7. **Start the Database & Services:**
   You can either run the backend and frontend separately or simultaneously from the root directory:
   ```bash
   npm run dev
   ```
   *(This triggers concurrently to launch both the frontend and backend servers).*

---

## 🧪 Working Demo

The TaskNest interface is fully operational and serves as the primary gateway for evaluation. 
- **Local Demo Link:** [http://localhost:5175](http://localhost:5175) *(or the active Vite port assigned during startup).*

The project supports the complete academic workflow:
- **Login/Registration:** Secure authentication loop.
- **Create Assignment:** Faculty can initiate objectives.
- **Submit:** Students submit Drive/GitHub links.
- **Evaluate:** Faculty assign grades and written feedback.

---

## 🧱 Project Structure

The repository is modularly split to enforce the separation of concerns:
- `/frontend`: The React (Vite) Single Page Application containing all UI components, pages, routing, and state management logic.
- `/backend`: The Node.js API layer containing Express controllers, SQL database configuration, and authentication middleware.

---

## 🧠 Key Design Decisions

- **Why PostgreSQL:** Chosen for its strict relational structure, foreign-key constraints, and ACID compliance, which are essential for maintaining accurate academic records without data orphaned anomalies.
- **Why JWT Authentication:** Provides stateless, highly scalable session management. It removes the need for database session lookups on every single API request.
- **Why Role-Based System:** Enforces a strict boundary between Student capabilities (submitting) and Faculty capabilities (evaluating/creating).
- **Why Modular Frontend Structure:** Grouping UI elements into reusable components (`Card`, `Modal`, `Button`) ensures UI consistency and drastically accelerates future development.

---

## 🚀 Deployment Considerations

TaskNest is built to be production-ready and easily deployable.
- **Backend Hosting:** Can be containerized via Docker and deployed to platforms like Render, Heroku, or AWS EC2.
- **Database Hosting:** Managed PostgreSQL instances (e.g., Supabase, RDS, Neon) provide scalable, highly available data storage.
- **Frontend Hosting:** The Vite build outputs static assets that can be distributed globally via Vercel, Netlify, or AWS CloudFront.
- **Environment Variables:** All secrets (Database keys, JWT constants) are strictly injected at runtime, ensuring complete repository safety.

---

## 📦 Deliverables Checklist

- [x] **GitHub Repository:** Clean, modular codebase and clear folder structure setup.
- [x] **Working Demo:** Fully functional system workflows seamlessly verified locally.
- [x] **Documentation:** Includes Overview, Setup instructions, API endpoints, Database schema, Architecture, and Key Design decisions inline with academic integrity requirements.

---

## 🔮 Future Improvements

While structurally sound, the platform is slated for continuous evolution. Planned upgrades include:
- **Real-Time Notification Implementation:** Instantly alert students of new objectives and graded feedback via WebSocket integration.
- **Better UI and UX Design:** Continuous aesthetic refinement, modern micro-interactions, and accessibility optimizations.
- **Implement Advanced Search and Filters:** Robust, multi-faceted filtering for institutional analytics and submission tracking.
- **Work on Authentication:** Expanding security matrices to include OAuth and Multi-Factor Authentication (MFA).
- **Optimize Performances and Scalability:** Re-architecting microservices to support massive, concurrent institutional loads.

---

## 🎯 Conclusion

TaskNest successfully transforms a chaotic academic landscape into a structured, highly visible operational flow. By leveraging a robust PostgreSQL backend and an elegant React frontend, it achieves real-world usability for institutions seeking to monitor assignment pipelines, track student formations, and deliver secure, transparent evaluations. It is structurally sound and fully ready for production deployment.
