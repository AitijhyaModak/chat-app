# AM ChatApp

A real-time chat application where users can create accounts, sign in, create rooms, and chat with others. The app is implemented using **PusherJs** for real-time communication, and **Next.js** for building a server-side rendered application.

**Live Preview:**  
[https://am-chatapp.netlify.app](https://am-chatapp.netlify.app)


## 🚀 Features

- **Account Creation & Authentication**:  
  Users can create accounts and sign in using **Next Auth** with **Google OAuth** for easy authentication.

- **Room Creation & Joining**:  
  Users can create and join chat rooms where they can communicate with others in real-time.

- **Ephemeral Chats**:  
  No chat history is stored in the database. Once the user leaves the room, the room is deleted.

- **Real-time Communication**:  
  Messages are delivered instantly to all users in a room via **PusherJS**, providing a seamless chat experience.


## 🛠️ Tech Stack

- **Next.js**
- **TailwindCSS**
- **Prisma**: For easy interaction with the **MongoDB** database, simplifying database management.
- **MongoDB**: For storing user accounts, room data, and related information (except chat messages).
- **PusherJS**: For real-time communication, enabling instant message delivery to all users in a room.


## 📝 How to Run the Project Locally

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/am-chatapp.git
```

### 2. Install Dependencies
```bash
cd chat-app
npm install
```

### 3. Set up Environment Variables as follows:
```bash
GOOGLE_AUTH_CLIENTID = google auth client id
GOOGLE_AUTH_CLIENTSECRET = google auth client secret
MONGODB_URL = mongodb url
NEXT_PUBLIC_PUSHER_APP_KEY = pusher app key
NEXTAUTH_SECRET = next auth secret
NEXTAUTH_URL = http://localhost:3000 
PUSHER_APP_ID = pusher app id
PUSHER_SECRET = pusher secret
```

### 4. Run the application
```bash
npm run dev
```

## 👨‍💻 Contributing

I welcome contributions to improve the app! Here’s how you can get involved:

- Fork the repository to your own GitHub account.
- Clone your fork to your local machine.
- Create a new branch for your changes (git checkout -b feature-name).
- Make the necessary changes or add a new feature.
- Commit your changes and push to your forked repository.
- Create a Pull Request to the main repository with a detailed description of your changes.
