import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";

function App() {
  return (
      <Router>
          <Routes>
              <Route path="/home"></Route>
              <Route path="/" element={<LoginPage />} />
          </Routes>
      </Router>
  );
}

export default App;
