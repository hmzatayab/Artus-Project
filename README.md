# MERN Stack Project - ARTUS

This is a full-stack web application built using the **MERN stack** (MongoDB, Express.js, React, and Node.js). The project includes a backend API built with **Node.js** and **Express.js**, and a frontend built with **React** and **Vite**. The application allows users to create profiles, post content, interact with posts, and manage followers.

---

## 🛠️ Features

- **User Authentication**: Login, Register, and Logout functionality.
- **User Profile Management**: Update and view profile, see followers.
- **Post Management**: Create, update, and delete posts.
- **Comments**: Comment on posts.
- **Follow/Unfollow Users**: Follow/unfollow users.
- **Responsive UI**: Built with Tailwind CSS and DaisyUI.
- **Protected Routes**: Secure routes for authenticated users.
- **Notifications Bar**: For user feedback and notifications.

---

## 🚀 Technologies Used

### Frontend
- **React**: JavaScript library for building user interfaces.
- **Vite**: Fast build tool for modern web applications.
- **Tailwind CSS**: Utility-first CSS framework.
- **React Router DOM**: Client-side routing.
- **Axios**: For HTTP requests to the backend.
- **Framer Motion**: Animations for a smooth user experience.
- **React Hot Toast**: For toast notifications.

### Backend
- **Node.js**: JavaScript runtime for the backend.
- **Express.js**: Web framework for Node.js.
- **MongoDB**: NoSQL database for data storage.
- **Mongoose**: MongoDB object modeling for Node.js.
- **JWT (JSON Web Tokens)**: User authentication mechanism.
- **Bcryptjs**: Password hashing for security.
- **Multer**: For handling file uploads.
- **CORS**: For enabling cross-origin requests.

---

## 📂 Project Structure

### BackEnd
```plaintext
backend/
├── config/
│   └── db.js          # MongoDB connection setup
├── routers/
│   ├── user.routes.js # User-related routes
│   ├── profile.routes.js # Profile-related routes
│   └── comment.routes.js # Comment-related routes
├── index.js           # Entry point for the backend
├── .env               # Environment variables
└── package.json       # Backend dependencies
```

### FrontEnd
```plaintext
frontend/
├── public/            # Static assets
├── src/
│   ├── Components/    # Reusable components
│   ├── Pages/         # Page components
│   ├── context/       # React context providers
│   ├── App.jsx        # Main application component
│   └── main.jsx       # Entry point for the frontend
├── .env               # Environment variables
└── package.json       # Frontend dependencies
```

---

## 🛠️ Setup Instructions

### Backend Setup
- **Clone the repository**:

```plaintext
git clone <repository-url>
cd backend
```
- **Install dependencies**:

```plaintext
npm install
```
- **Set up environment variables in a .env file**:

```plaintext
PORT=5000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret-key>
```
- **Start the backend server**:

```plaintext
npm start
```

### Frontend Setup
- **Navigate to the frontend directory**:

```plaintext
cd frontend
```

- **Install dependencies**:

```plaintext
npm install
```
- **Set up environment variables in a .env file**:

```plaintext
VITE_API_BASE_URL=http://localhost:5000
```
- **Start the frontend development server**:

```plaintext
npm run dev
```

---

## ⚙️ Running the Application

- **Start the backend server**:

```plaintext
cd backend
npm start
```
- **Start the frontend development serverr**:

```plaintext
cd frontend
npm run dev
```
- **Open your browser and navigate to**:

```plaintext
http://localhost:5173
```
---

## 🌐 API Endpoints
### User Routes

- **POST** `/user/register`: Register a new user.
- **POST** `/user/login`: Log in a user.
- **POST** `/user/update`: Update user profile information (authentication required).
- **GET** `/user/profile`: Get authenticated user's profile (authentication required).
- **GET** `/user/users`: Get all users (authentication required).
- **GET** `/user/posts`: Get posts from authenticated user (authentication required).
- **GET** `/user/all-posts`: Get all posts from all users.
- **GET** `/user/logout`: Log out the user.

### Profile Routes

- **GET** `/profile/:id`: Get a user's profile by ID.
- **PUT** `/profile/update`: Update a user's profile (authentication required).
- **GET** `/profile/:username`: Get a user's profile by username.
- **GET** `/profile/:userId/followers`: Get followers of a user.
- **GET** `/profile/:userId/following`: Get users followed by a user.

### Comment Routes

- **POST** `/comment/:postId`: Add a comment to a post (authentication required).
- **GET** `/comment/:postId`: Get all comments for a post.
- **PUT** `/comment/like/:commentId`: Like a comment (authentication required).
- **POST** `/comment/reply/:commentId`: Add a reply to a comment (authentication required).
- **PUT** `/comment/reply/like/:commentId/:replyId`: Like a reply on a comment (authentication required).

### Post Routes

- **POST** `/post/upload`: Upload an image (authentication required).
- **GET** `/post/like/:id`: Like a post (authentication required).
- **GET** `/post/:id`: Open a post.
- **GET** `/post/wishlist`: Get the user's wishlist (authentication required).

### Follow Routes

- **POST** `/follow`: Follow a user (authentication required).

---

### 📦 Dependencies

#### Backend
- **express**: Web framework for Node.js.
- **mongoose**: MongoDB object modeling for Node.js.
- **jsonwebtoken**: For authentication.
- **bcryptjs**: For password hashing.
- **multer**: For handling file uploads.
- **cors**: For enabling cross-origin requests.

#### Frontend
- **react**: JavaScript library for building UIs.
- **react-router-dom**: For client-side routing.
- **axios**: For making API requests.
- **tailwindcss**: Utility-first CSS framework.
- **framer-motion**: For animations.
- **react-hot-toast**: For toast notifications.

---

### 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch:  
   `git checkout -b feature/YourFeatureName`
3. Commit your changes:  
   `git commit -m 'Add some feature'`
4. Push to the branch:  
   `git push origin feature/YourFeatureName`
5. Open a pull request.

---

### 📝 License

This project is licensed under the MIT License. See the LICENSE file for details.








