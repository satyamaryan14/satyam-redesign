
# Workshop Booking Platform

**Workshop Booking Platform** is a high-performance, mobile-responsive web system designed for workshop coordinators to manage registrations and track session statistics. The platform utilizes a centralized design system to ensure a seamless experience across mobile, tablet, and desktop environments.

The system is intended for educational institutions and organizations to streamline the coordination of technical workshops, providing real-time data visualization and efficient user onboarding.

## Platform Features

### 📱 Responsive Web Interface
* **Technology:** React.js + Vite
* **Mobile-First Architecture:** Powered by a shared `useResponsive` hook and unified design tokens.
* **Dynamic Layouts:**
    * **Statistics Dashboard:** Features a slide-in filter drawer and auto-converting data tables (Table view on Desktop ↔ Card view on Mobile).
    * **Onboarding:** Multi-section registration forms optimized for thumb-friendly interaction.
* **Visual Analytics:** Integrated canvas-based charts for workshop and state-wise distribution.

### 🔗 Frontend Architecture
The system is built with a focus on **DRY (Don't Repeat Yourself)** principles:
* **Centralized Hook Layer:** Manages global breakpoints and window resize listeners.
* **Shared Design Tokens:** Ensures consistent button sizing (52px mobile targets), input styles, and navigation layouts.
* **State Management:** Optimized using React Hooks (`useState`, `useEffect`, `useRef`) for lightweight performance.

## System Architecture

The project is structured into modular layers to ensure scalability and maintainability:

* **Custom Hooks Layer:** The brain of the responsive system, handling screen detection and providing shared UI styles.
* **Page Modules:** Decoupled page components (Login, Registration, Statistics) that consume the responsive logic.
* **Export Engine:** Integrated logic for converting dashboard data into CSV formats for offline reporting.

## Repository Structure

```text
workshop_booking/
├── src/
│   ├── hooks/           # useResponsive.js (Logic & Design Tokens)
│   ├── pages/           # Core application views (Login, Statistics, Register)
│   ├── assets/          # Static resources and styling
│   └── App.jsx          # Main routing and navigation
├── public/              # Static assets
└── package.json         # Dependency management
```

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/satyamaryan14/satyam-redesign
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

## Project Status
🚧 **Under Active Development**
Recent updates include the full migration to a mobile-responsive system and redesign of the Statistics dashboard.

---
**Languages**
* **JavaScript (JSX):** 90%
* **CSS/Other:** 10%
