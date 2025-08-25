import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import SignInCard from './pages/auth/sign-in/sign-in';
import { Routes, Route } from 'react-router-dom';
import SignUpCard from './pages/auth/sign-up/sign-up';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignInCard />} />
        <Route path="/login" element={<SignInCard />} />
        <Route path="/signup" element={<SignUpCard />} />
      </Routes>
    </Router>
  );
}

export default App;
