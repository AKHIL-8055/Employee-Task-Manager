# Employee Task Manager

A full-stack Employee Task Management system built using Spring Boot for the backend and ReactJS for the frontend, with MySQL database integration. This application provides secure authentication, efficient task handling, and an intuitive user interface for optimal user experience.

## Project Structure

The repository is organized into two main components:

```
Employee-Task-Manager/
│
├── Emp_Task_Backend      - Spring Boot backend application
└── Emp_Task_Frontend     - ReactJS frontend application
```

## Backend - Emp_Task_Backend

### Technology Stack
- Java 17
- Spring Boot
- MySQL Database
- JWT Authentication

### Backend Setup Instructions

1. Ensure Java 17 is installed on your system

2. Navigate to the backend directory:
   ```bash
   cd Emp_Task_Backend
   ```

3. Install all required dependencies using Maven:
   ```bash
   mvn clean install
   ```

4. Create a MySQL database named `EmpTasks`

5. Verify database configuration in the `application.properties` file

6. Start the backend server:
   ```bash
   mvn spring-boot:run
   ```

## Frontend - Emp_Task_Frontend

### Technology Stack
- ReactJS
- Vite build tool
- Node.js version 11.6.2 or compatible

### Frontend Setup Instructions

1. Navigate to the frontend directory:
   ```bash
   cd Emp_Task_Frontend
   ```

2. Install project dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Database Configuration

- Database System: MySQL
- Database Name: EmpTasks
- All database connection settings and configurations can be found in the `application.properties` file

## Key Features Implemented

- Multiple Track Implementation: Complete full-stack development with dedicated backend and frontend components
- Secure Authentication: JWT token-based login system for enhanced security
- User-Friendly Interface: Clean and intuitive user interface with thoughtful user experience design
- Creative Design Elements: Visually appealing UI components demonstrating innovative design thinking

## Project Demonstration

Demo Video: [Insert your video link here]

## Getting Started

To download and set up the complete project:

```bash
git clone https://github.com/AKHIL-8055/Employee-Task-Manager.git
```

## Author

**Akhil Vulchi**  
Full Stack Developer specializing in Spring Boot, ReactJS, and Java development.
