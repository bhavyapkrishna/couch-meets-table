import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserProvider";

const CreateProfilePage = () => {
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);
    
    const [profile, setProfile] = useState({
        name: "",
        age: "",
        grade: "",
        major: "",
        bio: "",
        profilePhoto: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setUser((prev) => ({ ...prev, profile }));
        navigate("/profile");
    };

    return (
        <div className="container">
            <h2>Create Profile</h2>
            <form onSubmit={handleSubmit}>
                <label>Name:</label>
                <input type="text" name="name" value={profile.name} onChange={handleChange} required />

                <label>Age:</label>
                <input type="number" name="age" value={profile.age} onChange={handleChange} required />

                <label>Grade:</label>
                <input type="text" name="grade" value={profile.grade} onChange={handleChange} required />

                <label>Major:</label>
                <input type="text" name="major" value={profile.major} onChange={handleChange} required />

                <label>Bio:</label>
                <textarea name="bio" value={profile.bio} onChange={handleChange}></textarea>

                <button type="submit">Save Profile</button>
            </form>
        </div>
    );
};

export default CreateProfilePage;
