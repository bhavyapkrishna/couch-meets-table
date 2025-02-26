import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function HomePage()
{
    return (
        <div className="container-fluid custom-bg vh-100 d-flex flex-column justify-content-start pt-5">
            {/*Navbar*/}
            <nav className="navbar navbar-expand-lg navbar-dark custom-sec-bg fixed-top py-3">
                <div className="container-fluid">
                    <span className="navbar-brand ms-3">Couch Meets Table</span>
                    <span className="ms-auto me-3">
                    <Link to="/login" className="text-white text-decoration-none">
                        Log In
                    </Link>
                </span>
                </div>
            </nav>

            {/*Content*/}
            <div className="card p-4 text-center mt-5 border-0 custom-bg">
                <h1 className="h3 custom-txt">Are you ready to find your perfect roommate?</h1>
                <p className="custom-txt">Just fill out this quick questionnaire!</p>
            </div>

            {/*Start button*/}
            <div className="mt-3">
                <Link to="/login">
                    <button className="custom-btn">Start</button>
                </Link>
            </div>
        </div>
    )
}