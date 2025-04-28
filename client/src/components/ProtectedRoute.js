import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserProvider";

// protects routes based on user authentication
// redirects to login
const ProtectedRoute = ({ children }) => {
    const { user } = useContext(UserContext);

    if (!user || !user.profile || !user.quizResponse) {
        return <Navigate to="/login" replace />;
    }

    // render if authenticated
    return children;
};

export default ProtectedRoute;