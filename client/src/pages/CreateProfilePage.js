import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserProvider";
import Select from "react-select";
import Navbar from "../components/Navbar";

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
        Freshman: ["Juniper", "Mistletoe", "Cedar-Magnolia", "Clark"],
        Sophomore: ["Murray Hill", "Carlton Road", "Noyes", "Fayette"],
        Junior: ["The Village", "STJ", "PMAs", "Hazel"],
        Senior: ["The Village", "STJ", "PMAs", "Hazel"],
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
        <div className="container-fluid custom-bg vh-100 d-flex flex-column align-items-center pt-5">
            <Navbar />
            <div className="card p-4 mt-4 w-75 shadow-lg border-0">
                <h2 className="text-center mb-4 custom-txt">Create Profile</h2>
                <form onSubmit={handleSubmit} className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">Case ID:</label>
                        <input type="text" className="form-control" name="caseid" value={profile.caseid} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">First Name:</label>
                        <input type="text" className="form-control" name="first_name" value={profile.first_name} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Last Name:</label>
                        <input type="text" className="form-control" name="last_name" value={profile.last_name} onChange={handleChange} required />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">Age:</label>
                        <input type="number" className="form-control" name="age" value={profile.age} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Grade:</label>
                        <select className="form-select" name="grade" value={profile.grade} onChange={handleGradeChange} required >
                            <option value="">Select Grade</option>
                            <option value="Freshman">Freshman</option>
                            <option value="Sophomore">Sophomore</option>
                            <option value="Junior">Junior</option>
                            <option value="Senior">Senior</option>
                        </select>
                    </div>

                    {profile.grade && (
                        <div className = "col-12">
                            <label className="form-label">Dorm Preference:</label>
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
                                className="basic-multi-select"
                                classNamePrefix="select"
                                options={dormOptions}
                                value={dormOptions.filter(option => profile.dorms.includes(option.value))}
                                onChange={handleDormChange}
                                getOptionLabel={(e) => e.label}
                                getOptionValue={(e) => e.value}
                            />
                        </div>
                    )}

                    <div className="col-md-6">
                        <label className="form-label">Major:</label>
                        <input type="text" className="form-control" name="major" value={profile.major} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Bio:</label>
                        <textarea className="form-control" name="bio" value={profile.bio} onChange={handleChange}></textarea>
                    </div>
                    <div className="d-grid mt-4">
                        <button type="submit" className="btn btn-primary">Save Profile</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProfilePage;
