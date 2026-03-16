import React from 'react';
import Login   from './pages/Login';
import SignUp   from './pages/SignUp';
import Dashboard  from './pages/Dashboard';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
            
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<SignUp />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
        </Routes>
    </BrowserRouter>
  );
}

export default App;
