# Cohort 9 — MERN Assignment

## Notes Manager

A full-stack **Notes Manager** application developed as part of the **Cohort 9 MERN (Node.js + React.js) assignment**.

The application allows users to create an account, securely log in, and manage their personal notes through a React frontend and Node.js/Express backend.

The project also includes **frontend unit testing, API testing, accessibility improvements, code quality analysis with SonarQube, structured API services, validation, logging, and Git/GitHub Pull Request workflow**.

---

## 🚀 Tech Stack

### Frontend

* React.js
* React Router
* Axios
* CSS
* Vite
* React Quill
* Jest
* React Testing Library
* Jest DOM

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcrypt
* Express Validator
* Pino
* Pino HTTP

### Testing & Code Quality

* Jest
* React Testing Library
* Jest DOM
* Postman
* SonarQube

### Development Tools

* Git
* GitHub
* GitHub Pull Requests
* VS Code
* Postman
* MongoDB
* SonarQube

---

## 📁 Project Structure

```text
cohort-9-mern-16209-syed/
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── tests/
│   │   └── ...
│   │
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── tests/
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
└── README.md
```

---

## ⚙️ Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd cohort-9-mern-16209-syed
```

### 2. Backend Setup

Open a terminal and run:

```bash
cd backend
npm install
npm run dev
```

The backend server will start using the development script configured in `package.json`.

### 3. Frontend Setup

Open another terminal and run:

```bash
cd frontend
npm install
npm run dev
```

The frontend application will start using Vite.

---

## 🔐 Environment Variables

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

If required, configure the frontend API URL according to the frontend API configuration.

> **Important:** Never commit `.env` files to GitHub.

---

## ✨ Features

### Authentication

* User registration
* User login
* Password hashing using bcrypt
* JWT-based authentication
* Protected routes
* Authentication middleware
* Automatic handling of unauthorized requests
* Secure logout

### Notes Management

* Create notes
* View personal notes
* View individual notes
* Edit notes
* Delete notes
* Search notes
* Rich-text note editing
* Loading states
* Error states
* Empty-state handling

### User Profile

* View user profile
* Profile menu
* User information
* Logout functionality

### Frontend

* React component-based architecture
* React Router navigation
* Reusable UI components
* Axios API integration
* Centralized API configuration
* JWT token handling
* Responsive styling
* Accessibility improvements

---

## 🔗 API Integration

The frontend communicates with the backend through REST APIs using Axios.

The API layer is organized into separate services for better maintainability.

```text
frontend/src/

├── api/
│   └── api.js
│
└── services/
    ├── authService.js
    └── notesService.js
```

The Axios configuration handles:

* API base URL
* Authorization headers
* JWT token attachment
* Unauthorized (`401`) responses
* Authentication cleanup
* API communication errors

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint         | Description         |
| ------ | ---------------- | ------------------- |
| POST   | `/auth/register` | Register a new user |
| POST   | `/auth/login`    | Login user          |

### Notes

| Method | Endpoint     | Description                    |
| ------ | ------------ | ------------------------------ |
| GET    | `/notes`     | Get authenticated user's notes |
| POST   | `/notes`     | Create a new note              |
| GET    | `/notes/:id` | Get a specific note            |
| PUT    | `/notes/:id` | Update a note                  |
| DELETE | `/notes/:id` | Delete a note                  |

> Make sure these endpoints match the actual `authRoutes.js` and `notesRoutes.js` implementation.

---

## 🧪 Testing

Testing was implemented to improve application reliability and code quality.

### Frontend Testing

The frontend uses:

* Jest
* React Testing Library
* Jest DOM

Frontend tests cover important areas such as:

* Component rendering
* User interactions
* Navigation
* Dashboard components
* Authentication components
* API configuration
* API services
* Loading states
* Error handling

Run frontend tests:

```bash
cd frontend
npm test
```

---

### API Testing

API endpoints were tested using **Postman**.

The API testing covers:

* User registration
* User login
* JWT authentication
* Protected routes
* Create notes
* Get notes
* Get individual note
* Update notes
* Delete notes
* Invalid requests
* Authentication errors

---

## 📊 SonarQube Code Quality

**SonarQube** was used to analyze the project's code quality.

The analysis focused on:

* Bugs
* Vulnerabilities
* Code smells
* Duplicated code
* Maintainability
* Test coverage
* Overall code quality

Code was refactored where necessary to improve readability, maintainability, and quality.

---

## ♿ Accessibility

Accessibility improvements were implemented throughout the frontend.

The application considers:

* Semantic HTML
* Accessible buttons
* Form labels
* Keyboard-friendly interactions
* Accessible navigation
* Proper interactive elements
* Improved form accessibility

---

## 🛡️ Security

The application implements several security practices:

* bcrypt password hashing
* JWT authentication
* Protected API routes
* Authentication middleware
* Environment variables for sensitive configuration
* `.gitignore` for sensitive files
* Authorization headers
* Input validation
* Authentication error handling

---

## 📝 Validation & Error Handling

The backend includes request validation and structured error handling.

The application handles:

* Required field validation
* Invalid user input
* Authentication failures
* Unauthorized requests
* Invalid JWT tokens
* Missing resources
* Database errors
* API errors
* Frontend loading states
* Frontend error states

---

## 📋 Logging

The backend uses **Pino / Pino HTTP** for structured HTTP logging.

Logging helps with:

* Request monitoring
* Debugging
* Error investigation
* Development troubleshooting

---

## 🌿 Git Workflow

The project follows a feature-branch development workflow.

Example branches:

```text
feature/backend/controllers
feature/backend/middleware
feature/backend/routes
feature/backend/services

feature/frontend/components
feature/frontend/pages
feature/frontend/styles
feature/frontend/testing
feature/frontend/api
```

### Git Workflow

```bash
git checkout -b feature/frontend/testing

git add .

git commit -m "test: add frontend component tests"

git push origin feature/frontend/testing
```

Changes are submitted through **GitHub Pull Requests** before merging.

---

## 🔧 Development Practices

The project follows common software development practices:

* Modular project structure
* Frontend/backend separation
* Reusable React components
* Service-based API organization
* Middleware-based backend architecture
* Environment-based configuration
* Input validation
* Error handling
* Authentication and authorization
* Unit testing
* API testing
* Code quality analysis
* Accessibility improvements
* Code refactoring
* Git feature branches
* Pull Request-based development

---

## 👨‍💻 Author

**Syed Mustafa Hussain**

**Cohort 9 — MERN Assignment**

### Notes Manager

Full-Stack MERN Application
