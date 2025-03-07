import {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import Navbar from "../components/Navbar";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {UserContext} from "../UserProvider";

const SignUpPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { user } = useContext(UserContext);

    const handleSignUp = () =>
    {
        if(!email.endsWith("@case.edu")) {
            alert("Please enter a valid CWRU email address")
            return;
        }
        if(!password) {
            alert("Please enter a password")
            return;
        }
        if(password != passwordCheck) {
            alert("Passwords do not match")
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
                <h1 className="h3 custom-txt">Create Account</h1>
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
                <input 
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm Password" 
                    value={passwordCheck}
                    onChange={(e) => setPasswordCheck(e.target.value)}
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
                <button onClick={handleSignUp} className="custom-btn">Create Account</button>
            </div>
        </div>
    )
}

export default SignUpPage;