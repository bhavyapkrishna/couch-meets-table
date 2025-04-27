import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { UserContext } from "../UserProvider";


function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { pathname } = location;
    const { user, setUser } = useContext(UserContext);

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
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                setUser({
                    profile: {},
                    quizResponse: [],
                });  
                navigate("/login");
            } else {
                console.error("Failed to log out", await response.json());
            }
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

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
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");

                setUser({
                    profile: {},
                    quizResponse: {},
                });

                navigate("/signup");
            } else {
                console.error("failed to delete account", await response.json());
            }
        } catch (error) {
            console.error("failed to delete account", error);
        }
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark custom-sec-bg fixed-top py-3">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand ms-3">
                    Couch Meets Table
                </Link>
                <div className="ms-auto me-3 d-flex gap-3">
                    {(user.quizResponse.length > 0) ? (
                        <>
                            <Link
                                to="/swiping"
                                className={`text-white text-decoration-none ${pathname === "/swiping" ? "fw-bold border-bottom border-white" : ""}`}
                            >
                                Swiping
                            </Link>
                            <Link
                                to="/profile"
                                className={`text-white text-decoration-none ${pathname === "/profile" ? "fw-bold border-bottom border-white" : ""}`}
                            >
                                Profile
                            </Link>

                            <button onClick={handleLogOut} className="btn btn-link text-white text-decoration-none">
                                Logout
                            </button>

                            <button onClick={handleDeleteAcc} className="btn btn-link text-white text-decoration-none">
                                Delete Account
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            className={`text-white text-decoration-none ${pathname === "/login" ? "fw-bold border-bottom border-white" : ""}`}
                        >
                            Log In
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;