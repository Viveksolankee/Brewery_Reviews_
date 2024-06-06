
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Components/Logincmp/login';
import Signup from './Components/Registercmp/register';
import Search from './Components/Searchcmp/search';
import Brewery from './Components/Brewerycmp/Brewery';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Signup />} />
        <Route path="/search" element={<Search />} />
        <Route path="/brewery/:id" element={<Brewery />} />
      </Routes>
    </Router>
  );
}

export default App;