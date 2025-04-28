import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card, Image } from "react-bootstrap";
import Navbar from "../components/Navbar";
import profilePic from "../assets/images/stock.jpg";
import { UserContext } from "../UserProvider";
import { fetchDataWithTokenRefresh } from '../auth/authServices';

// map quiz response to labels
const quizResponseLabels = (key, value) => {
    const options = {
        wakeTime: ["Early", "Somewhat early", "Average", "Somewhat late", "Late"],
        sleepTime: ["Early", "Somewhat early", "Average", "Somewhat late", "Late"],
        noise: ["Silent", "Somewhat quiet", "Average", "Somewhat loud", "Loud"],
        messiness: ["Neat", "Somewhat neat", "Average", "Somewhat messy", "Messy"],
        guests: ["Rarely", "Somewhat rarely", "Sometimes", "Somewhat often", "Often"],
        inRoom: ["Rarely", "Somewhat rarely", "Sometimes", "Somewhat often", "Often"],
    };
    return options[key]?.[value] ?? "Not specified";
}

const ProfilePage = () => {
    const { user, setUser } = useContext(UserContext);
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    //load from backend
    const loadProfile = async () => {
        setLoading(true);
        setError(null);

        try {
            const accessToken = localStorage.getItem('access_token');
            if (!accessToken) {
                throw new Error("No authentication token found");
            }

            const data = await fetchDataWithTokenRefresh();

            if (!data) {
                navigate('/login');
            }

            // quiz responses to labels
            const labelMap = {
                wakeTime: "Wake Time",
                sleepTime: "Sleep Time",
                noise: "Noise Level",
                messiness: "Messiness",
                guests: "Guests in Room",
                inRoom: "Time Spent In Room"
            };

            const quizResponse = Object.keys(labelMap).map((key) => ({
                label: labelMap[key],
                value: data.results[key],
                displayValue: quizResponseLabels(key, data.results[key])
            }));

            //format profile data
            const formattedProfileData = {
                profile: {
                    caseid: data.caseid,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    age: data.age,
                    grade: data.grade,
                    major: data.major,
                    bio: data.bio,
                    email: data.email,
                    dorms: data.dorms || [],
                    profile_photo: data.profile_photo,
                    media_url: data.media_url,
                },
                quizResponse,
            };

            setProfileData(formattedProfileData);
            setUser(formattedProfileData);
            localStorage.setItem('profile_data', JSON.stringify(formattedProfileData));

        } catch (error) {
            console.error('Profile load error:', error);
            setError(error.message);

            if (error.message.includes('Session expired') ||
                error.message.includes('No authentication') ||
                error.message.includes('Unauthorized')) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('profile_data');
                navigate('/login');
            }

        } finally {
            setLoading(false);
        }
    };

    // load profile data from local storage
    useEffect(() => {
        const savedProfile = localStorage.getItem('profile_data');
        if (savedProfile) {
            setProfileData(JSON.parse(savedProfile));
            setLoading(false);
        }
        loadProfile();
    }, [navigate]);

    // redirect after errors
    useEffect(() => {
        if (error) {
            alert("Session expired. Please log in again.");
            navigate('/login');
        }
    }, [error, navigate]);

    if (!user || !user.profile || !user.quizResponse) {
        return (
            <div className="container">
                <h2>Loading...</h2>
                <p>Your profile is still being set up. Please try again later.</p>
            </div>
        );
    }

    // loading page
    if (loading && !profileData) {
        return (
            <div className="container">
                <h2>Loading...</h2>
                <p>Loading your profile information...</p>
            </div>
        );
    }

    // if profile data does not load
    if (!profileData) {
        return (
            <div className="container">
                <h2>No Profile Data</h2>
                <p>Unable to load profile information.</p>
            </div>
        );
    }

    //profile photo source
    let profilePhotoSource;
    if (profileData.profile.profile_photo) {
        profilePhotoSource =  `${profileData.profile.media_url}${profileData.profile.profile_photo}`;
    } else {
        profilePhotoSource = profilePic; 
    }

    return (
        <div className="min-vh-100 d-flex flex-column overflow-hidden">
            <Navbar />

            {/* Profile */}
            <Container fluid className="d-flex flex-grow-1 justify-content-center align-items-center">
                <Card className="p-4 border-0 shadow w-75 d-flex flex-row">
                    <Row className="align-items-center w-100">
                        {/* Image */}
                        <Col md={4} className="text-center">
                            <Image
                                src={profilePhotoSource}
                                rounded
                                fluid
                                className="border border-primary p-1"
                                style={{ maxWidth: "300px", height: "auto" }}
                                alt="Profile"
                            />
                        </Col>

                        {/* Info */}
                        <Col md={8}>
                            <h3><strong>{profileData.profile.first_name} {profileData.profile.last_name}, {profileData.profile.age}</strong></h3>
                            <p><strong>Grade:</strong> {profileData.profile.grade}</p>
                            <p><strong>Major:</strong> {profileData.profile.major}</p>
                            <p><strong>Dorm Preference:</strong> {profileData.profile.dorms.join(", ")}</p>
                            <p><strong>Bio:</strong> {profileData.profile.bio}</p>

                            <hr />
                            <div className="quiz-response">
                                {profileData.quizResponse.map((response, index) => (
                                    <p key={index} className="mb-2">
                                        <strong>{response.label}:</strong> {response.displayValue}
                                    </p>
                                ))}
                            </div>
                        </Col>
                    </Row>
                </Card>
            </Container>
        </div>
    );
};

export default ProfilePage;
