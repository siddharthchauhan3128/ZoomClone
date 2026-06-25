# 🎥 Zoom Clone

A real-time **peer-to-peer video conferencing application** built using **React**, **Node.js**, **Express**, **Socket.IO**, **WebRTC**, and **MongoDB**. The application enables users to securely create accounts, join video meetings, and communicate through direct peer-to-peer connections with low latency.

---

# ✨ Features

* 🎥 Peer-to-peer video calling using WebRTC
* 🎙️ Real-time audio communication
* 🔇 Microphone toggle
* 📷 Camera toggle
* 👥 Create and join meeting rooms
* 🔗 Unique meeting IDs generated using Crypto
* 📜 Meeting history
* 👤 Secure user authentication
* 🔒 Password hashing with bcrypt
* ⚡ Socket.IO signaling server
* 📱 Responsive interface

---

# 🛠️ Tech Stack

## Frontend

* React.js
* React Router DOM
* Context API
* Socket.IO Client
* WebRTC API
* Vite
* CSS

## Backend

* Node.js
* Express.js
* Socket.IO
* bcrypt
* crypto
* dotenv

## Database

* MongoDB
* Mongoose

---

# 🔐 Authentication & Security

* Passwords are securely hashed using **bcrypt** before being stored in the database.
* Unique meeting identifiers and secure random values are generated using **Node.js Crypto**.
* Sensitive configuration is managed through environment variables.
* User credentials are never stored in plain text.

---
# 📂 Project Structure
```text
ZOOM
├── Backend
│   ├── src
│   │   ├── controllers
│   │   │   ├── socket.controller.js
│   │   │   └── user.controller.js
│   │   ├── init
│   │   │   └── connectDb.js
│   │   ├── models
│   │   │   ├── meeting.model.js
│   │   │   └── user.model.js
│   │   ├── routes
│   │   │   └── user.route.js
│   │   └── server.js
│   ├── .env
│   ├── package.json
│   └── package-lock.json
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── context
│   │   │   ├── AuthContext.jsx
│   │   │   └── HistoryContext.jsx
│   │   ├── pages
│   │   │   ├── Authentication.jsx
│   │   │   ├── Dashboard.jsx
│   │   │  ├── Landing.jsx
│   │   │  └── VideoMeetComponent.jsx
│   │   ├── utils
│   │   │  └── WithAuth.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

# 🔄 Peer-to-Peer Communication

The application uses **WebRTC** to establish direct connections between users. **Socket.IO** is used only for signaling (exchange of SDP offers, answers, and ICE candidates).

```text
User A
   │
   │
Socket.IO Signaling Server
   │
   ▼
User B

Offer
────────────►

Answer
◄────────────

ICE Candidates
◄────────────►

Direct WebRTC Connection

Video 🎥 + Audio 🎙️
```

Unlike server-based conferencing systems, media streams are transmitted **directly between peers**, reducing latency and server load.

---

# 🚀 Future Enhancements

* Screen Sharing
* In-meeting Chat
* File Sharing
* Group Video Calls
* Meeting Recording
* Virtual Backgrounds
* AI Meeting Notes
* End-to-End Encryption
* Mobile Support

---

# 👨‍💻 Author

**Siddharth Chauhan**

If you found this project useful, consider giving it a ⭐ on GitHub!
