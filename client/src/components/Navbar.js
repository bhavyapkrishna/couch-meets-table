import {Link, useLocation} from "react-router-dom";

function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { pathname } = location;
    const { user, setUser } = useContext(UserContext);

    const handleLogOut = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null);
        navigate("/login");
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark custom-sec-bg fixed-top py-3">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand ms-3">
                    Couch Meets Table
                </Link>
                <div className="ms-auto me-3 d-flex gap-3">
                    {user ? (
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