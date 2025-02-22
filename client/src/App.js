import * as React from 'react';
import './style.css';
import { Link } from 'react-router-dom';

function App() {
  return (
    <Router>
      <nav className="p-4 bg-gray-300 flex gap-4">
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/signup">Sign up</Link>
        <Link to="/quiz">Quiz</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/swiping">Swiping</Link>
        <Link to="/matches">Matches</Link>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/swiping" element={<SwipingPage />} />
        <Route path="/matches" element={<MatchesPage />} />
      </Routes>
    </Router>
  );
}

export default App;