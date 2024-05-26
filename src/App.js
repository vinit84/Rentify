// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Home from './components/Home';
import "./App.css"
import Login from './components/Login';
import Seller from './components/Seller';
import Houses from './components/Houses';
import DetailsPage from './components/DetailsPage';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/seller" element={<Seller/>} />
          <Route path="/searches" element={<Houses/>} />
          <Route path="/details/:userId/:propertyId" element={<DetailsPage />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
