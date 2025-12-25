# ⚡ FlowBolt

**FlowBolt** is a Jira-inspired **task & ticket management system** designed to manage projects, tickets, workflows, and team collaboration with strong role-based access control.

This repository follows a **monorepo structure**:
- `client/` → Frontend (React + MUI)
- `server/` → Backend (Spring Boot / WebFlux)

---

## ✨ Features

### 🗂 Project & Ticket Management
- Create and manage projects
- Create tickets and sub-tickets
- Assign tickets to users
- Track ticket lifecycle with configurable workflows

### 🔄 Workflow & Permissions
- Status-based workflow transitions (e.g. `CREATED → ASSIGNED → IN_PROGRESS`)
- Permission-controlled status changes
- Role-based access control (RBAC)

### 📊 Dashboard
- Jira-style dashboards
- Ticket summaries and status breakdowns
- Clean, responsive UI

### ⚡ Reactive Backend
- Non-blocking APIs using **Spring WebFlux**
- Efficient data aggregation using `Mono` / `Flux`
- Secure authorization & validation logic

---

## 🧱 Tech Stack

### Frontend (`client/`)
- **React**
- **Material UI (MUI)** (peer dependency)
- Custom reusable UI components
- Responsive & pixel-perfect layouts

### Backend (`server/`)
- **Java**
- **Spring Boot**
- **Spring WebFlux**
- Reactive programming (`Mono`, `Flux`)
- REST APIs
- Role & permission based authorization

---

## 📁 Project Structure

```bash
.
├── client/               # Frontend application
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/               # Backend application
│   ├── src/main/java
│   ├── src/main/resources
│   └── pom.xml
│
└── README.md

