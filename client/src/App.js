import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import QuizPage from "./pages/QuizPage";
import CreateProfilePage from "./pages/CreateProfilePage";
import ProfilePage from "./pages/ProfilePage";
import SwipePage from "./pages/SwipePage";
import MatchesPage from "./pages/MatchesPage";
import {UserProvider} from "./UserProvider";

function App() {
  return (
      <UserProvider>
              <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignUpPage />} />
                  <Route path="/quiz" element={<QuizPage />} />
                  <Route path="/createProfile" element={<CreateProfilePage />} />

                  <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                  <Route path="/swiping" element={<ProtectedRoute><SwipePage /></ProtectedRoute>} />
                  <Route path="/matches" element={<ProtectedRoute><MatchesPage /></ProtectedRoute>} />
                  
                  <Route path="*" element={<h2>404: Page Not Found</h2>} />
              </Routes>
      </UserProvider>
  );
}

export default App;
