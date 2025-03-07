import {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import Navbar from "../components/Navbar";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {UserContext} from "../UserProvider";

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { user } = useContext(UserContext);

    const handleLogin = () =>
    {
        if(!email.endsWith("@case.edu")) {
            alert("Please enter a valid CWRU email address")
            return;
        }
        if(!password) {
            alert("Please enter a password")
            return;
        }
        navigate("/profile");
    };

    const setPasswordVisible = () => {
        setShowPassword(!showPassword);
    };

    return (
       <div className="container-fluid custom-bg vh-100 d-flex flex-column justify-content-start pt-5">
            <Navbar />
            {/*Content*/}
            <div className="card p-4 text-center mt-5 border-0 custom-bg">
                <h1 className="h3 custom-txt">Log In</h1>
                <input 
                    type="text" 
                    placeholder="CWRU Email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input 
                    type={showPassword ? "text" : "password"}
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <span
                    onMouseDown={setPasswordVisible}
                    onMouseUp={setPasswordVisible}
                    onMouseLeave={() => setShowPassword(false)}
                >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
            </div>
            <div className="mt-3">
                <button onClick={handleLogin} className="custom-btn">Log In</button>
            </div>
            {/*<h1>hello, {user || "Guest"}!</h1>*/}
        </div>
    )
}

export default LoginPage;