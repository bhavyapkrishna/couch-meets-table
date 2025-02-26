import { useState } from "react";
import {useNavigate} from "react-router-dom";

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () =>
    {
        navigate("/");
    };

    return (
        <div className = "container">
            <h1>Log In</h1>
            <input 
                type="text" 
                placeholder="CWRU Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin} className="custom-btn">Log In</button>
        </div>
    )
}

export default LoginPage;