import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import QuizPage from "./pages/QuizPage";
import ProfilePage from "./pages/ProfilePage";
import SwipePage from "./pages/SwipePage";
import {UserProvider} from "./UserContext";

function App() {
  return (
      <UserProvider>
          <Router>
              <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/quiz" element={<QuizPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/swiping" element={<SwipePage />}></Route>
              </Routes>
          </Router>
      </UserProvider>
  );
}

export default App;
