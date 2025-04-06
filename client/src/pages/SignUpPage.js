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

    const handleSignUp = async (e) => {
        e.preventDefault();
    
        if (!email.endsWith("@case.edu")) {
            alert("Please enter a valid CWRU email address");
            return;
        }
    
        if (password !== passwordCheck) {
            alert("Passwords do not match");
            return;
        }
    
        try {
            const response = await fetch('http://localhost:8000/api/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',  // Make sure headers are set correctly
                },
                body: JSON.stringify({
                    'caseid': user.profile.caseid,
                    'first_name': user.profile.first_name,
                    'last_name': user.profile.last_name,
                    'age': user.profile.age,
                    'grade': user.profile.grade,
                    'major': user.profile.major,
                    'bio': user.profile.bio,
                    'email': email,
                    'password': password
                }),
            });
    
            if (response.ok) {
                const data = await response.json();
                alert('User created successfully!');
                console.log('Success:', data); // More detailed logging
            } else {
                const errorData = await response.json();
                console.error('Error creating user:', errorData); // Log error data
                alert('Error creating user: ' + (errorData.detail || 'Something went wrong'));
            }
        } catch (error) {
            console.error('There was an error!', error);
            alert('Error creating user.');
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
                    required
                />
                <input 
                    type={showPassword ? "text" : "password"}
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input 
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm Password" 
                    value={passwordCheck}
                    onChange={(e) => setPasswordCheck(e.target.value)}
                    required
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