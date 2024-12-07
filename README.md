# ChatApp

## Welcome to the ChatApp! 🚀

### NOTE: PULL REQUESTS ONLY FROM THE STUDENTS OF IIEST, SHIBPUR WILL BE ACCEPTED, IF YOU ARE NOT A STUDENT OF IIESTS, KINDLY IGNORE THIS REPOSITORY

This is a real-time chat application where users can create accounts, sign in, create rooms, and chat with others. The app leverages cutting-edge technologies like PusherJS for real-time communication and Next.js for server-side rendering.

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
---

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

### 3.Create a .env file as follows:
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
---

## 👨‍💻 How to Contribute
We encourage developers of all skill levels to contribute to this project. Here's how you can get started:

- Check the Issues tab and Select a issue that interests you.
- Fork the repository to your own GitHub account.
- Clone your fork to your local machine.
- Create a new branch for your changes:
```bash
git checkout -b feature-name
```  
- Make the necessary changes or add a new feature.
- Commit your changes and push them to your forked repository.
- Create a Pull Request to the main repository with a detailed description of your changes.
- Try to follow the existing coding style and conventions.
- Provide clear and concise commit messages.
- Test your code before submitting a pull request.
  
---

## ⭐ Acknowledgements
Thank you for taking the time to contribute! Every contribution, no matter how small, helps improve this project. If you have any questions, feel free to open a new issue or reach out to the maintainers.
