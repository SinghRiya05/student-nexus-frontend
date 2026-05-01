# ✨ Student Nexus - Frontend Application

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Redux](https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

The user interface for **Student Nexus**, a modern networking platform for the academic community. Built with performance, accessibility, and aesthetics in mind.

---

## 🎨 Design Philosophy

- **Premium Aesthetics**: Clean layouts with glassmorphism and subtle gradients.
- **Fluid Interactions**: Smooth page transitions and micro-animations via Framer Motion.
- **Responsive First**: Optimized for everything from mobile phones to ultra-wide monitors.
- **Modern Stack**: Utilizing Next.js 15 App Router and Tailwind CSS 4 for cutting-edge development.

---

## 🚀 Interactive Features

- **⚡ Instant Feed**: Real-time social feed with optimistic updates.
- **💬 Live Chat**: Seamless messaging experience with typing indicators and read receipts.
- **🎓 Smart Directory**: Easily discover peers, professors, and alumni with AI-powered search.
- **🛠️ Role-Based UI**: Dynamic interfaces that change based on whether you are a Student, Alumini, or Teacher.
- **🌓 Dark Mode Support**: Beautifully crafted dark and light themes.

---

## 📂 Project Structure

```text
student-nexus-frontend/
├── app/                # Next.js App Router (Pages & Layouts)
│   ├── (main)/         # Main application shell (Feed, Profile, etc.)
│   ├── (dashboard)/    # Admin/Management dashboards
│   └── chat/           # Real-time communication interface
├── components/         # Reusable UI components
│   ├── layouts/        # Header, Sidebar, Footer
│   └── ui/             # Shadcn & Custom atomic components
├── features/           # Redux slices and business logic (Thunks)
├── services/           # Axios API clients and Socket.io config
├── lib/                # Shared utilities and library configurations
└── public/             # Static assets (Logos, Icons)
```

---

## 🛠️ Getting Started

### Installation
1. **Clone the repository**
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Environment Setup**
   Create a `.env.local` file with the following:
   ```env
   NEXT_PUBLIC_BACKEND_BASEURL=http://localhost:5000/api/v1
   NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
   NEXT_PUBLIC_ASSET_BACKEND_BASEURL=http://localhost:5000
   ```
4. **Run Dev Server**
   ```bash
   npm run dev
   ```

---

## 🧪 Tech Stack Details

- **Framework**: Next.js 15 (App Router)
- **State**: Redux Toolkit (Thunks for Async logic)
- **UI Components**: Shadcn UI + Radix UI
- **Styling**: Tailwind CSS 4
- **Forms**: React Hook Form + Zod
- **Real-time**: Socket.io-client

---

Developed with ❤️ for the student community.
