import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { UserContext } from "../UserProvider";

// Navigation bar component for top of web page
function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { pathname } = location;
    const { user, setUser } = useContext(UserContext);
    const [errorMessage, setErrorMessage] = useState("");

    //user logout
    const handleLogOut = async () => {
        const accessToken = localStorage.getItem("access_token");
        const refreshToken = localStorage.getItem("refresh_token");

        try {
            const response = await fetch("http://localhost:8000/api/logout/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ refresh_token: refreshToken }), 
            });

            if (response.ok) {
                // clear storage, reset user context
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                setUser({
                    profile: {},
                    quizResponse: [],
                });  
                navigate("/login");
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.detail || "Failed to log out. Please try again.");
            }
        } catch (error) {
            setErrorMessage("Error during logout. Please try again.");
        }
    };

    //user account deletion
    const handleDeleteAcc = async () => {
        const accessToken = localStorage.getItem("access_token");

        try {
            const response = await fetch("http://localhost:8000/api/delete-account/", {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.ok) {
                //clear local storage and reset user context
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");

                setUser({
                    profile: {},
                    quizResponse: {},
                });

                navigate("/signup");
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.detail || "Failed to log out. Please try again.");
            }
        } catch (error) {
            setErrorMessage("Error during logout. Please try again.");
        }
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark custom-sec-bg fixed-top py-3">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand ms-3">
                    Couch Meets Table
                </Link>
                
                {/* navigation links */}
                <div className="ms-auto me-3 d-flex gap-3">
                    {/* user authenticated */}
                    {["/swiping", "/matches", "/profile"].includes(pathname) && (
                        <>
                            <Link
                                to="/swiping"
                                className={`text-white text-decoration-none ${pathname === "/swiping" ? "fw-bold border-bottom border-white" : ""}`}
                            >
                                Swiping
                            </Link>
                            <Link to="/matches" className={`text-white text-decoration-none ${location.pathname === "/matches" ? "fw-bold border-bottom border-white" : ""}`}>
                                Matches
                            </Link>
                            <Link to="/profile" className={`text-white text-decoration-none ${location.pathname === "/profile" ? "fw-bold border-bottom border-white" : ""}`}>
                                Profile
                            </Link>

                            {/* Account buttons */}
                            <button
                                onClick={handleLogOut}
                                className={`text-white text-decoration-none bg-transparent border-0 p-0 m-0 ${pathname === "/logout" ? "fw-bold border-bottom border-white" : ""}`}
                                style={{ cursor: "pointer" }}
                            >
                                Logout
                            </button>

                            <button
                                onClick={handleDeleteAcc}
                                className={`text-white text-decoration-none bg-transparent border-0 p-0 m-0 ${pathname === "/delete-account" ? "fw-bold border-bottom border-white" : ""}`}
                                style={{ cursor: "pointer" }}
                            >
                                Delete Account
                            </button>

                        </>
                    )}

                    {/* User not authenticated */}
                    {["/", "/signup", "/login", "/quiz", "/createProfile"].includes(pathname) && (
                        <>
                            <Link to="/login" className={`text-white text-decoration-none ${location.pathname === "/login" ? "fw-bold border-bottom border-white" : ""}`}>
                                Log In
                            </Link>
                        </>

                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;