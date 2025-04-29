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

    // form submission
    const handleSignUp = async (e) => {
        e.preventDefault();
    
        // email valid
        if (!email.endsWith("@case.edu")) {
            alert("Please enter a valid CWRU email address");
            return;
        }
    
        // password match
        if (password !== passwordCheck) {
            alert("Passwords do not match");
            return;
        }

        try {
            // labels for quiz responses
            const labels = ['wakeTime', 'sleepTime', 'noise', 'messiness', 'guests', 'inRoom']
            
            // map responses to objects
            const resultsValues = user.quizResponse.map(q => q.self.value);
            const idealValues = user.quizResponse.map(q => q.ideal.value);
            const importantValues = user.quizResponse.map(q => q.important.value === undefined ? 0 : 1);

            // create objects
            const results = Object.fromEntries(labels.map((label, index) => [label, resultsValues[index]]));
            const ideal = Object.fromEntries(labels.map((label, index) => [label, idealValues[index]]));
            const important = Object.fromEntries(labels.map((label, index) => [label, importantValues[index]]));
            
            // send to server
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
    
            // check if successful
            if (!registerResponse.ok) {
                const errorData = await registerResponse.json();
                alert('Error creating user.');
                return;
            }

            // login to get token after
            const tokenResponse = await fetch("http://localhost:8000/api/token/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
    
            // check if successful
            if (!tokenResponse.ok) {
                alert("Login failed.");
                return;
            }
    
            const tokenData = await tokenResponse.json();
            localStorage.setItem("access_token", tokenData.access);
            localStorage.setItem("refresh_token", tokenData.refresh);

            // upload profile photo
            if (user.profile.profile_photo) {
                const form_data = new FormData();
                form_data.append('profile_photo', user.profile.profile_photo);

                const profilePhotoResponse = await fetch('http://localhost:8000/api/profile/upload_photo/', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${tokenData.access}`,
                    },
                    body: form_data,
                });

                //error message
                if (!profilePhotoResponse.ok) {
                    const errorData = await profilePhotoResponse.json();
                    alert('Error uploading profile photo.');
                }
            }

            // fetch profile after successful login
            const profileResponse = await fetch("http://localhost:8000/api/profile/", {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${tokenData.access}`,
                    'Content-Type': 'application/json',
                },
            });
    
            // error
            if (!profileResponse.ok) {
                alert("Failed to fetch profile.");
                return;
            }
    
            const userData = await profileResponse.json();

            // map profile to responses
            const quizResponse = labels.map((label) => ({
                self: { label, value: userData.results[label] },
                ideal: { label, value: userData.preferences[label] },
                important: { label, value: userData.important[label] },
            }));
    
            // set with fetched profile data and responses
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
            alert('Error creating user.');
        }
    };

    // toggle visibility
    const setPasswordVisible = () => {
        setShowPassword(!showPassword);
    };

    return (
       <div className="container-fluid custom-bg vh-100 d-flex flex-column justify-content-start pt-5">
            <Navbar />
            {/*Content*/}
            <div className="card p-4 text-center mt-5 border-0 custom-bg">
                <h1 className="h3 custom-txt">Create Account</h1>
                {/* email */}
                <input 
                    type="text" 
                    placeholder="CWRU Email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                {/* password */}
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
                {/* show/hide password */}
                <span
                    onMouseDown={setPasswordVisible}
                    onMouseUp={setPasswordVisible}
                    onMouseLeave={() => setShowPassword(false)}
                >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
            </div>
            {/* submit button */}
            <div className="mt-3">
                <button onClick={handleSignUp} className="custom-btn">Create Account</button>
            </div>
        </div>
    )
}

export default SignUpPage;