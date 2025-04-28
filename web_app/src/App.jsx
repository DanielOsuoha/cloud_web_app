import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './components/Landing';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import UpdatePassword from './components/Auth/UpdatePassword';
import { AuthProvider } from './context/AuthContext';
// import PrivateRoute from './components/Auth/PrivateRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/update-password" element={
              <UpdatePassword />
          } />
          <Route path="/" element={<Landing />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;