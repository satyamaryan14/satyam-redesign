Workshop Booking Platform
A high-performance, mobile-responsive React application designed for workshop coordinators to manage registrations and track session statistics.

Tech Stack
Frontend: React.js (v18+)

Build Tool: Vite (for ultra-fast HMR)

State Management: React Hooks (useState, useEffect, useRef)

Styling: Modular CSS & Dynamic JS Design Tokens

Project Structure:
src/
├── hooks/
│   └── useResponsive.js      # Global screen-sizing & design tokens
├── pages/
│   ├── LoginPage.jsx         # Optimized auth flow
│   ├── RegistrationPage.jsx  # Multi-section coordinator signup
│   └── StatisticsPage.jsx    # Data dashboard with CSV export
└── App.jsx                   # Component routing

Getting Started
Clone the repo: git clone <https://github.com/satyamaryan14/satyam-redesign>

Install: npm install

Run: npm run dev