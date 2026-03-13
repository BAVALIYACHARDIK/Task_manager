import React from 'react';
import Login   from './pages/Login';
import Dashboard  from './pages/Dashboard';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
            
            <Route path="/auth/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
        </Routes>
    </BrowserRouter>
  );
}

export default App;
