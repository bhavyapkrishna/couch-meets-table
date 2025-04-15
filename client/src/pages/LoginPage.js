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
    const { user, setUser } = useContext(UserContext);

    const fetchProfileWithAccessToken = async (accessToken) => {
        const response = await fetch("http://localhost:8000/api/profile/", {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
    
        if (!response.ok) {
            throw new Error("Failed to fetch profile.");
        }
    
        const userData = await response.json();
    
        // Parse quizResponse structure
        const labels = ['wakeTime', 'sleepTime', 'noise', 'messiness', 'guests', 'inRoom'];
        const results = userData.results;
        const ideal = userData.preferences;
        const important = userData.important;
    
        const quizResponse = labels.map((label) => ({
            self: { label, value: results[label] },
            ideal: { label, value: ideal[label] },
            important: { label, value: important[label] },
        }));
    
        return {
            profile: {
                caseid: userData.caseid,
                first_name: userData.first_name,
                last_name: userData.last_name,
                age: userData.age,
                grade: userData.grade,
                major: userData.major,
                bio: userData.bio,
                email: userData.email,
                dorms: userData.dorms,
            },
            quizResponse,
        };
    };

    const handleLogin = async () =>
    {
        if(!email.endsWith("@case.edu")) {
            alert("Please enter a valid CWRU email address")
            return;
        }

        if(!password) {
            alert("Please enter a password")
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/api/token/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
    
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("access_token", data.access);
                localStorage.setItem("refresh_token", data.refresh);
    
                const userData = await fetchProfileWithAccessToken(data.access);
                setUser(userData);
    
                navigate("/profile");
            } else {
                const errorData = await response.json();
                console.error("Login error:", errorData);
                alert("Invalid email or password.");
            }
        } catch (error) {
            console.error("There was an error!", error);
            alert("Error logging in.");
        }
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
                    required
                />
                <input 
                    type={showPassword ? "text" : "password"}
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                <button onClick={handleLogin} className="custom-btn">Log In</button>
            </div>
            {/*<h1>hello, {user || "Guest"}!</h1>*/}
        </div>
    )
}

export default LoginPage;