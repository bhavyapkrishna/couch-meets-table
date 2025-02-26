import {Link, useLocation} from "react-router-dom";

function Navbar() {
    const location = useLocation();

    return (
        <nav className="navbar navbar-expand-lg navbar-dark custom-sec-bg fixed-top py-3">
            <div className="container-fluid">
                <span className="navbar-brand ms-3">Couch Meets Table</span>
                <div className="ms-auto me-3">
                    <Link to="/login" 
                    className={`text-white text-decoration-none ${location.pathname === "/login" ? "fw-bold border-bottom border-white" : ""}`}>
                        Log In
                    </Link>
                </div>
            </div>
        </nav>
    )
}

