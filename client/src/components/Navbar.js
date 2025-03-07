import {Link, useLocation} from "react-router-dom";

function Navbar() {
    const location = useLocation();
    const { pathname } = location;

    return (
        <nav className="navbar navbar-expand-lg navbar-dark custom-sec-bg fixed-top py-3">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand ms-3 ">
                    Couch Meets Table
                </Link>
                <div className="ms-auto me-3 d-flex gap-3">
                    {["/swiping", "/profile"].includes(pathname) && (
                        <>
                            <Link to="/swiping" className={`text-white text-decoration-none ${location.pathname === "/swiping" ? "fw-bold border-bottom border-white" : ""}`}>
                                Swiping
                            </Link>
                            <Link to="/profile" className={`text-white text-decoration-none ${location.pathname === "/profile" ? "fw-bold border-bottom border-white" : ""}`}>
                                Profile
                            </Link>
                        </>
                    )}
                    {["/", "/login", "/quiz"].includes(pathname) && (
                        <>
                            <Link to="/login" className={`text-white text-decoration-none ${location.pathname === "/login" ? "fw-bold border-bottom border-white" : ""}`}>
                                Log In
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar;