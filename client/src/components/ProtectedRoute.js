import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserProvider";

const ProtectedRoute = ({ children }) => {
    const { user } = useContext(UserContext);

    if (!user || !user.profile || !user.quizResponse) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;