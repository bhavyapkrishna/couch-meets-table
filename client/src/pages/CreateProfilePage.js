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
        dorms: [],
        bio: "",
        profilePhoto: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name == "dorms") {
            const dorms = Array.from(e.target.selectedOptions, option => option.value);
            setProfile((prev) => ({ ... prev, dorms: dorms }));
        } else {
            setProfile((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setUser((prev) => ({ ...prev, profile }));
        navigate("/profile");
    };

    const dormOptions = {
        Freshman: ["Juniper", "Clark"],
        Sophomore: ["Noyes", "Alumni"],
        Junior: ["Triangle", "Hazel"],
        Senior: ["Triangle", "Hazel"],
    }

    return (
        <div className="container">
            <h2>Create Profile</h2>
            <form onSubmit={handleSubmit}>
                <label>Name:</label>
                <input type="text" name="name" value={profile.name} onChange={handleChange} required />

                <label>Age:</label>
                <input type="number" name="age" value={profile.age} onChange={handleChange} required />

                <label>Grade:</label>
                <select name="grade" value={profile.grade} onChange={handleChange} required >
                    <option value="Freshman">Freshman</option>
                    <option value="Sophomore">Sophomore</option>
                    <option value="Junior">Junior</option>
                    <option value="Senior">Senior</option>
                </select>

                {profile.grade && (
                    <>
                        <label>Dorm Preference:</label>
                        <select name="dorms" value={profile.dorms} onChange={handleChange} multiple required>
                            {dormOptions[profile.grade].map((dorm, index) => (
                                <option key={index} value={dorm}>
                                    {dorm}
                                </option>
                            ))}
                        </select>
                    </>
                )}

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
