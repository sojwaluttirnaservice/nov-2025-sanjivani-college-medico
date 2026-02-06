# MedoPlus Project Setup Guide

This guide provides step-by-step instructions to set up the **MedoPlus** project locally. The project consists of three main components:

1.  **Backend API** (`/api`) - Node.js, Express, MySQL
2.  **Web Client** (`/client`) - React, Vite
3.  **Mobile App** (`/app`) - React Native, Expo

---

## 1. Prerequisites

Before starting, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher ([Download](https://nodejs.org/))
- **MySQL Server**: v8.0 or higher ([Download](https://dev.mysql.com/downloads/installer/))
- **Git**: ([Download](https://git-scm.com/))
- **VS Code** (Recommended)

**For Mobile Development:**

- **Android Studio** (for Android Emulator)
- **Java JDK 17** (Required for React Native 0.73+)
- **Expo Go App** (Optional: to run on a physical device)

---

## 2. Backend Setup (`/api`)

The backend handles the database, authentication, and AI services.

### Step 2.1: Initial Setup

1.  Navigate to the api directory:
    ```bash
    cd api
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

### Step 2.2: Database Configuration

1.  Open your MySQL Client (Workbench or Command Line).
2.  Create a new database:
    ```sql
    CREATE DATABASE medoplus_db;
    ```
3.  Create a `.env` file in the `api` folder:
    - **Mac/Linux**: `cp .env.example .env`
    - **Windows**: `copy .env.example .env`
4.  Update your `.env` file with these values:
    ```env
    PORT=2555
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_mysql_password
    DB_NAME=medoplus_db
    JWT_SECRET=your_super_secret_key
    GEMINI_API_KEY=your_google_gemini_api_key
    ```
    _(Note: You can get a Gemini API key from Google AI Studio)_

### Step 2.3: Initialize Database

Run the following scripts **in order** to set up tables and seed data:

1.  **Sync Schema** (Create Tables):
    ```bash
    npm run dbSync
    ```
2.  **Seed Data** (Insert Test Data):
    ```bash
    npm run dbInitData
    ```
    _This creates default users, roles, and initial settings._

### Step 2.4: Run the Server

```bash
npm run dev
```

_Server should start on `http://localhost:2555`_

---

## 3. Web Client Setup (`/client`)

The web dashboard for admins and pharmacies.

### Step 3.1: Initial Setup

1.  Open a new terminal.
2.  Navigate to the client directory:
    ```bash
    cd client
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```

### Step 3.2: Configuration

1.  Create a `.env` file in the `client` folder:
    ```env
    VITE_API_URL=http://localhost:2555/api/v1
    ```

### Step 3.3: Run the Client

```bash
npm run dev
```

_The web app should open at `http://localhost:5173`_

---

## 4. Mobile App Setup (`/app`)

The patient-facing mobile application.

### Step 4.1: Initial Setup

1.  Open a new terminal.
2.  Navigate to the app directory:
    ```bash
    cd app
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```

### Step 4.2: Configuration

1.  Open `app/services/api.js`.
2.  Update the `API_URL` to point to your computer's local IP address.
    - **Mac/Linux**: Type `ipconfig getifaddr en0` in terminal.
    - **Windows**: Type `ipconfig` in Command Prompt and look for **"IPv4 Address"**.
    ```javascript
    // api/services/api.js
    // Replace with your actual IP (e.g., 192.168.1.5)
    const API_URL = "http://192.168.1.5:2555/api/v1";
    ```

### Step 4.3: Run the App

1.  Start the Metro bundler:
    ```bash
    npx expo start
    ```
2.  **To run:**
    - **Android Emulator**: Press `a` (Requires Android Studio).
    - **iOS Simulator**: Press `i` (**Mac Only** - Not available on Windows).
    - **Physical Device**: Scan the QR code with the **Expo Go** app.

---

## Troubleshooting

- **"Port Already in Use"**: If port 2555 or 5173 is taken, kill the existing process or change the port in `.env`.
- **Database Connection Failed**: Double-check `DB_PASSWORD` and ensure MySQL server is running.
- **Mobile App Network Error**: Ensure your phone/emulator is on the same WiFi as your computer and that you are using the correct Local IP in `api.js` (not `localhost`).
