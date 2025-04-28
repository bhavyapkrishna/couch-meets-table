import {Link, useNavigate} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/Navbar";

export default function HomePage() {
    return (
        <div className="container-fluid custom-bg vh-100 d-flex flex-column justify-content-start pt-5">
            <Navbar />
            
            {/*Content*/}
            <div className="card p-4 text-center mt-5 border-0 custom-bg">
                <h1 className="h3 custom-txt">Are you ready to find your perfect roommate?</h1>
                <p className="custom-txt">Just fill out this quick questionnaire!</p>
            </div>

            {/*Start button*/}
            <div className="mt-3">
                <Link to="/quiz">
                    <button className="custom-btn">Start</button>
                </Link>
            </div>
        </div>
    )
}