import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserProvider";
import Select from "react-select";

const CreateProfilePage = () => {
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    const [profile, setProfile] = useState({
        caseid: "",
        first_name: "",
        last_name: "",
        age: "",
        grade: "",
        major: "",
        dorms: [],
        bio: "",
        profilePhoto: "",
    });

    const [dormOptions, setDormOptions] = useState([]);

    const dormsByGrade = {
        Freshman: ["Juniper", "Clark"],
        Sophomore: ["Noyes", "Alumni"],
        Junior: ["Triangle", "Hazel"],
        Senior: ["Triangle", "Hazel"],
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleDormChange = (selectedOptions) => {
        setProfile((prev) => ({
            ...prev,
            dorms: selectedOptions ? selectedOptions.map(option => option.value) : []
        }))
    };

    const handleGradeChange = (e) => {
        const selectedGrade = e.target.value;
        setProfile((prev) => ({...prev, grade: selectedGrade }));

        if (selectedGrade) {
            const updatedDorms = dormsByGrade[selectedGrade];
            setDormOptions(updatedDorms.map(dorm => ({value: dorm, label: dorm})));
        } else {
            setDormOptions([]);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setUser((prev) => ({ ...prev, profile }));
        navigate("/signup");
    };

    return (
        <div className="container">
            <h2>Create Profile</h2>
            <form onSubmit={handleSubmit}>
                <label>Case ID:</label>
                <input type="text" name="caseid" value={profile.caseid} onChange={handleChange} required />

                <label>First Name:</label>
                <input type="text" name="first_name" value={profile.first_name} onChange={handleChange} required />

                <label>Last Name:</label>
                <input type="text" name="last_name" value={profile.last_name} onChange={handleChange} required />

                <label>Age:</label>
                <input type="number" name="age" value={profile.age} onChange={handleChange} required />

                <label>Grade:</label>
                <select name="grade" value={profile.grade} onChange={handleGradeChange} required >
                    <option value="">Select Grade</option>
                    <option value="Freshman">Freshman</option>
                    <option value="Sophomore">Sophomore</option>
                    <option value="Junior">Junior</option>
                    <option value="Senior">Senior</option>
                </select>

                {profile.grade && (
                    <>
                        <label>Dorm Preference:</label>
                        {/*<select name="dorms" value={profile.dorms} onChange={handleChange} multiple required>*/}
                        {/*    {dormOptions[profile.grade].map((dorm, index) => (*/}
                        {/*        <option key={index} value={dorm}>*/}
                        {/*            {dorm}*/}
                        {/*        </option>*/}
                        {/*    ))}*/}
                        {/*</select>*/}
                        {/*multiselect react-select attempt*/}
                        <Select
                            isMulti
                            name="dorms"
                            options={dormOptions}
                            value={dormOptions.filter(option => profile.dorms.includes(option.value))}
                            onChange={handleDormChange}
                            getOptionLabel={(e) => e.label}
                            getOptionValue={(e) => e.value}
                        />
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
