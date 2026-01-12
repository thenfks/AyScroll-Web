# 🚀 AyScroll - Web Platform

A modern, immersive learning platform built with React, Vite, and Supabase. AyScroll combines a sleek, glassmorphic UI with robust session management and data visualization to provide a premium user experience.

<img width="1709" height="984" alt="image" src="https://github.com/user-attachments/assets/657d8010-4b95-462d-b6fa-91dbbd28fdcc" />


## ✨ Key Features

### 🔐 authentication & Security

<img width="1710" height="990" alt="image" src="https://github.com/user-attachments/assets/cc9bd47a-de4e-4d62-8413-82cddde45d43" />


- **Global Session Tracking**: Real-time tracking of active devices across the application.
- **Active Devices Manager**: View device type, browser, OS, and location for all active sessions.
- **Remote Revocation**: Securely sign out or revoke access from other devices directly from the settings.
- **Auto-Logout**: Devices automatically log out when their session is revoked remotely.
- **Supabase Auth**: Integration with Email/Password , Google OAuth and nFKs Auth (Works best with AyScroll).

### 📊 Analytics & Visualization

<img width="1709" height="988" alt="image" src="https://github.com/user-attachments/assets/0e0b78b3-6d2f-4b7a-ba15-c2482c844f69" />


- **Dynamic Charts**: Interactive `Recharts` visualizations for:
  - **Weekly Activity**: Smooth gradient area charts showing learning minutes.
  - **Daily Activity**: Detailed breakdown of daily engagement.
  - **Focus Quality**: Circular progress indicators.
- **Proficiency Tracking**: Visual progress bars for different learning topics.
- **Milestones**: Gamified progress tracking with rewards.

### 👤 User Profile
- **Personal Dashboard**: comprehensive view of user stats, streaks, and achievements.
- **Customizable**: Dark mode preferences, account settings, and profile management.
- **Responsive Design**: Fully optimized for Desktop, Tablet (iPadOS detection), and Mobile.
<img width="414" height="899" alt="image" src="https://github.com/user-attachments/assets/04fc0017-8d3d-4613-8ba7-2e2e43f122cc" />


## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS, Lucide React (Icons)
- **State Management**: React Context (AuthContext)
- **Backend / DB**: Supabase (PostgreSQL, Auth, Realtime)
- **Visualization**: Recharts
- **Utilities**: `ua-parser-js` (implicit), custom device detection logic.

## 🗄️ Database Schema

### `public.user_sessions`
Tracks active user sessions for security management.
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key)
- `ip_address`, `location`: Geo-data
- `browser`, `os`, `device_type`: Device fingerprinting
- `last_active`: Timestamp of last activity

<img width="809" height="866" alt="image" src="https://github.com/user-attachments/assets/3b7f013d-f96d-457d-b9a2-35f634b28833" />


> **Note**: See `supabase/SETUP_SESSIONS.md` for migration instructions.

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/thenfks/AyScroll-Web.git
   cd AyScroll-Web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## 📜 License
© 2025-2026 AyScroll. All rights reserved.
