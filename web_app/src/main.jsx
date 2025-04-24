import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './index.css'; // Import our global styles

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);


//mongodb+srv://dosuoha:<db_password>@cluster0.1ziqjik.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0



//63SngoHHhZxYklc0