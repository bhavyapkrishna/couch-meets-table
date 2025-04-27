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
    const { user, setUser } = useContext(UserContext);

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
            const labels = ['wakeTime', 'sleepTime', 'noise', 'messiness', 'guests', 'inRoom']
            const resultsValues = user.quizResponse.map(q => q.self.value);
            const idealValues = user.quizResponse.map(q => q.ideal.value);
            const importantValues = user.quizResponse.map(q => q.important.value === undefined ? 0 : 1);

            const results = Object.fromEntries(labels.map((label, index) => [label, resultsValues[index]]));
            const ideal = Object.fromEntries(labels.map((label, index) => [label, idealValues[index]]));
            const important = Object.fromEntries(labels.map((label, index) => [label, importantValues[index]]));

            console.log("results: ", results)
            console.log("preferences", ideal)
            console.log("important", important)
            
            const registerResponse = await fetch('http://localhost:8000/api/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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
                    'password': password,
                    'results': results,
                    'preferences': ideal,
                    'important': important,
                    'dorms': user.profile.dorms
                }),
            });
    
            if (!registerResponse.ok) {
                const errorData = await registerResponse.json();
                console.error('Error creating user:', errorData);
                alert('Error creating user.');
                return;
            }
    
            const tokenResponse = await fetch("http://localhost:8000/api/token/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
    
            if (!tokenResponse.ok) {
                alert("Login failed.");
                return;
            }
    
            const tokenData = await tokenResponse.json();
            localStorage.setItem("access_token", tokenData.access);
            localStorage.setItem("refresh_token", tokenData.refresh);

            if (user.profile.profile_photo) { // Use the correct state name
                const form_data = new FormData();
                form_data.append('profile_photo', user.profile.profile_photo);

                const profilePhotoResponse = await fetch('http://localhost:8000/api/profile/upload_photo/', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${tokenData.access}`,
                    },
                    body: form_data,
                });

                if (!profilePhotoResponse.ok) {
                    const errorData = await profilePhotoResponse.json();
                    console.error('Error uploading profile photo:', errorData);
                    alert('Error uploading profile photo.');
                }
            }

            const profileResponse = await fetch("http://localhost:8000/api/profile/", {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${tokenData.access}`,
                    'Content-Type': 'application/json',
                },
            });
    
            if (!profileResponse.ok) {
                alert("Failed to fetch profile.");
                return;
            }
    
            const userData = await profileResponse.json();
    
            const quizResponse = labels.map((label) => ({
                self: { label, value: userData.results[label] },
                ideal: { label, value: userData.preferences[label] },
                important: { label, value: userData.important[label] },
            }));
    
            setUser({
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
            });
    
            navigate("/profile");
            
        } catch (error) {
            console.error('There was an error!', error);
            alert('Error creating user.');
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