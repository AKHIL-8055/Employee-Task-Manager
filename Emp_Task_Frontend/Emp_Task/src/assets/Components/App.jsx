import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './SignUp';
import SignIn from './SignIn';
import Home from './Home';
import AddNewTask from './AddNewTask';
import Completed from './Completed';
import Pending from './Pending';
import Profile from './Profile';
import StartDate from './StartDate';


function App() {
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/signup" 
            element={!isAuthenticated() ? <SignUp /> : <Navigate to="/home" />} 
          />
          <Route 
            path="/signin" 
            element={!isAuthenticated() ? <SignIn /> : <Navigate to="/home" />} 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/home/*" 
            element={isAuthenticated() ? <Home /> : <Navigate to="/signin" />} 
          />
          <Route
            path="/profile"
            element={isAuthenticated() ? <Profile /> : <Navigate to="/signin" />}
          />
          <Route
            path="/add-task"
            element={isAuthenticated() ? <AddNewTask /> : <Navigate to="/signin" />}
          />
          <Route
            path="/pending"
            element={isAuthenticated() ? <Pending /> : <Navigate to="/signin" />}
          />
          <Route
            path="/completed"
            element={isAuthenticated() ? <Completed /> : <Navigate to="/signin" />}
          />
          <Route
            path="/start-date"
            element={isAuthenticated() ? <StartDate /> : <Navigate to="/signin" />}
          />
          
          {/* Default Route */}
          <Route 
            path="/" 
            element={<Navigate to={isAuthenticated() ? "/home" : "/signin"} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;