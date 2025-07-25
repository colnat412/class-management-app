# 📚 Classroom Management App

A full-stack web application for managing classrooms, built with:

- **Frontend**: Next.js + Tailwind CSS + TypeScript
- **Backend**: Express.js + TypeScript
- **Database**: Firebase Firestore
- **Real-time Messaging**: Socket.IO (Chat between Students & Instructors)
- **Email Verification**: Nodemailer (OTP via email)

---

## 📁 Project Structure

```
ClassManagementApp/
│
├── backend/                # Node.js + Express backend
│   ├── routes/             # REST API endpoints
│   ├── controllers/        # Request handlers
│   ├── services/           # Firebase logic, business rules
│   ├── firebase/           # Firebase initialization
│   ├── socket/             # Socket.IO server events
│   ├── seeds/              # Seed data for lessons/students
│   ├── server.ts           # Entry point with socket + REST
│   └── app.ts              # Express config only
│
├── frontend/               # Next.js frontend
│   ├── components/         # UI Components
│   ├── app/                # Pages and routing
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Helper functions
│   └── public/             # Static assets (images, fonts)
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+ (recommended)
- Firebase account
- Gmail (for nodemailer testing)
- `pnpm`, `npm`, or `yarn` as package manager

---

### 🔧 Backend Setup

```bash
cd backend
npm install
```

#### ▶️ Run Backend Server

```bash
npm run dev     # With ts-node-dev
# or
npm run start   # For production build
```

---

### 🌐 Frontend Setup

```bash
cd frontend
npm install
```

#### 🌍 Environment variables (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3030/api
```

#### ▶️ Run Frontend App

```bash
npm run dev
```

---

## ✨ Core Features

- ✅ Instructor adds student (email-based OTP)
- ✅ Student verifies account via link
- ✅ Instructor assigns lessons to students
- ✅ Student sees assigned lessons
- ✅ Real-time 1-1 chat between student and instructor via Socket.IO
- ✅ Firebase stores message history

---

## 💬 Real-time Chat

- Rooms are created using email pair: `instructorEmail__studentEmail`
- Messages include: `sender`, `receiver`, `message`, `timestamp`
- Messages are stored in Firestore under collection `messages/{roomId}/messageList`

## 🧑‍💻 Author

Nguyễn Tấn Lộc  
🔗 [GitHub Profile](https://github.com/colnat412)  
📧 nguyentanloc041203@gmail.com

---