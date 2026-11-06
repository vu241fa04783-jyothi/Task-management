# 🌸 TaskNest – Personal Cycle Tracking System

## 📌 Project Overview

**TaskNest** is a personal cycle tracking web application designed to help users record, monitor, and understand their menstrual cycle patterns.

The application provides a simple and user-friendly dashboard where users can record period dates, monitor cycle information, maintain period history, track symptoms, and view estimated upcoming periods through an interactive calendar.

TaskNest helps users organize their personal tracking information in one place.

## 👥 Team Details (College Training Project)

**Project Type:** College Training Project  
**Project Domain:** Web Development  
**Project Name:** TaskNest – Personal Cycle Tracking System

**Team Members:**
- Team Leader: [Enter Name]
- Team Member 2: [Enter Name]
- Team Member 3: [Enter Name]
- Team Member 4: [Enter Name]

**College:** [Enter College Name]  
**Department:** Computer Science and Engineering  
**Academic Year:** 2026–2027

## 🎯 Project Objectives

The main objectives of TaskNest are:

1. To develop a simple and user-friendly cycle tracking application.
2. To allow users to record period start dates and end dates.
3. To calculate average cycle length and period duration.
4. To predict upcoming period dates based on previously recorded information.
5. To provide a calendar view of recorded and estimated dates.
6. To maintain period history for future reference.
7. To allow users to record and monitor different symptoms.
8. To provide a responsive interface with light and dark themes.
9. To demonstrate frontend and backend communication using REST APIs.
10. To provide local data storage as a fallback when the API server is unavailable.

## 💻 Technologies & Architecture

### Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Structure of the application |
| CSS3 | Styling and responsive design |
| JavaScript (ES6) | Application logic and functionality |
| JSON Server | Mock REST API backend |
| JSON | Storing application records |
| Local Storage | Browser-side data backup |
| Fetch API | Communication between frontend and backend |
| Node.js and npm | Running the backend server |

### System Architecture

The application follows a simple three-layer architecture.

**1. Presentation Layer**
- HTML
- CSS
- User interface
- Dashboard and calendar

**2. Application Layer**
- JavaScript
- Cycle calculations
- Symptom management
- API communication
- Data processing

**3. Data Layer**
- JSON Server
- db.json
- Browser Local Storage

### Architecture Flow

User → HTML/CSS Interface → JavaScript Logic → Fetch API → JSON Server → db.json

Local Storage is used as a fallback when API requests fail.

## 🔑 Pre-Configured Demo Login Credentials

**Authentication Status:** Not implemented.

TaskNest currently does not include a login, registration, or password authentication module.

Users can access the application directly through its interface.

No demo username or password is required.

## 🚀 Key Modules & Functionalities

### 1. Overview Dashboard
- Displays a personalized welcome message.
- Shows current cycle day.
- Displays estimated days until the next period.
- Shows average cycle length.
- Shows average period duration.
- Displays the last recorded period.
- Shows the next predicted period.
- Displays the current estimated cycle phase.
- Shows recently recorded symptoms.

### 2. Period Tracking Module
- Add period records.
- Enter period start date.
- Enter period end date.
- Select flow intensity:
  - Light
  - Medium
  - Heavy
- Add additional notes.
- Save period information.

### 3. Calendar Module
- Displays an interactive monthly calendar.
- Highlights recorded period dates.
- Shows estimated upcoming period dates.
- Highlights the current date.
- Provides previous-month and next-month navigation.

### 4. Period History Module
- Displays all previously recorded periods.
- Shows the total number of recorded periods.
- Calculates the shortest cycle.
- Calculates the longest cycle.
- Allows users to review and delete records.

### 5. Symptom Tracking Module
- Add symptoms with dates.
- Select symptom types:
  - Cramps
  - Headache
  - Back Pain
  - Bloating
  - Mood Swings
  - Fatigue
  - Acne
  - Other
- Select symptom intensity:
  - Mild
  - Moderate
  - Severe
- Add additional notes.
- Search and filter symptom records.
- View and delete recorded symptoms.

### 6. Theme Management
- Light and dark theme support.
- Simple navigation between application sections.
- User-friendly interface.

### 7. Data Management
- Fetch records from JSON Server.
- Save new records through REST API requests.
- Delete existing records.
- Use Local Storage as a fallback when the backend is unavailable.

**Note:** Cycle predictions are estimates based on recorded dates and are not medical advice.

## 🗄️ Database Design (MongoDB Collections)

**Actual Database:** JSON-based storage using JSON Server.

This project does not currently use MongoDB. The following are its actual JSON collections.

### Collection 1: periods

Stores period tracking information.

| Field | Data Type | Description |
|---|---|---|
| id | Number/String | Unique record ID |
| startDate | String | Period starting date |
| endDate | String | Period ending date |
| flow | String | Flow intensity |
| notes | String | Additional information |

### Collection 2: symptoms

Stores symptom tracking information.

| Field | Data Type | Description |
|---|---|---|
| id | Number/String | Unique record ID |
| date | String | Symptom recorded date |
| type | String | Symptom category |
| intensity | String | Symptom intensity |
| notes | String | Additional information |

### Database File

`db.json`

The file contains two main collections:

- periods
- symptoms

JSON Server automatically exposes these collections through REST API endpoints.

## 📡 REST API Documentation

**Base URL:**

`http://localhost:3000`

### Period APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | /periods | Retrieve all period records |
| POST | /periods | Add a new period record |
| DELETE | /periods/:id | Delete a period record |

### Symptom APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | /symptoms | Retrieve all symptom records |
| POST | /symptoms | Add a new symptom |
| DELETE | /symptoms/:id | Delete a symptom record |

### Example: Add Period Record

**POST** `/periods`

Request Body:

```json
{
  "startDate": "2026-11-01",
  "endDate": "2026-11-05",
  "flow": "Medium",
  "notes": "Sample record"
}
```

### Example: Add Symptom

**POST** `/symptoms`

Request Body:

```json
{
  "date": "2026-11-01",
  "type": "Headache",
  "intensity": "Moderate",
  "notes": "Sample record"
}
```

## 🛠️ Installation & Local Execution

Follow these steps to run TaskNest on your local computer.

### Prerequisites

Install the following:

- Node.js
- npm
- Visual Studio Code
- Web browser

### Step 1: Clone the GitHub Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### Step 2: Open the Project Folder

```bash
cd task_management
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Start the Backend Server

```bash
npm start
```

The JSON Server will run at:

`http://localhost:3000`

### Step 5: Start the Frontend

Open the project folder in Visual Studio Code.

Use the Live Server extension to open `index.html`.

### Step 6: Access the Application

Open the frontend URL provided by Live Server.

The TaskNest dashboard will appear in your browser.

**Important:** Keep the backend server running while using the application.

## 🌐 Public Deployment Guide

TaskNest can be deployed using a static frontend hosting service and a separately hosted backend.

### Frontend Deployment
1. Upload the project to GitHub.
2. Connect the repository to a static hosting platform.
3. Configure the frontend root directory.
4. Deploy the HTML, CSS and JavaScript files.

### Backend Deployment
1. Deploy the JSON Server backend separately.
2. Configure a publicly accessible API URL.
3. Update the `apiConfig.js` file with the deployed backend URL.
4. Configure CORS and API access appropriately.
5. Test all API operations after deployment.

### Important Deployment Considerations

- The current project uses `localhost:3000`.
- A public deployment requires replacing the local API URL.
- JSON Server is intended for development and demonstrations, not secure production use.
- A production version should use an authenticated backend and a properly secured database.
- Do not publish real personal tracking records or sensitive user information in a public repository.

## 📊 Presentation Slides (10 Slides)

The following is the suggested structure for the college project presentation.

| Slide | Title | Content |
|---|---|---|
| 1 | Project Title | TaskNest, team members and college details |
| 2 | Introduction | Project overview and problem statement |
| 3 | Project Objectives | Main goals and purpose |
| 4 | Technologies Used | HTML, CSS, JavaScript, JSON Server |
| 5 | System Architecture | Frontend, backend and data flow |
| 6 | Database Design | Periods and symptoms collections |
| 7 | Key Modules | Dashboard, calendar, history and symptom tracker |
| 8 | REST API Implementation | GET, POST and DELETE operations |
| 9 | Application Demo | Screenshots and working demonstration |
| 10 | Conclusion & Future Scope | Project outcomes and improvements |

## ⚖️ License & Academic Integrity

### License

This project is developed as part of a college training program for educational and learning purposes.

The project can be used for academic demonstration and learning.

A formal open-source license has not yet been selected. All rights are reserved by the project authors unless a license is added.

### Academic Integrity

- This project is intended for educational purposes.
- All team members should understand the code and implementation.
- Third-party libraries are used according to their respective licenses.
- Project documentation should accurately represent the implemented features.
- Any future improvements should be clearly distinguished from the existing implementation.

---

## 🌸 TaskNest

**Track Your Cycle. Understand Your Patterns. Stay Organized.**

Developed as a College Training Project by the Computer Science and Engineering team.
