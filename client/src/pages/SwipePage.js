import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card, Image, Button } from "react-bootstrap";
import profilePic from "../assets/images/stock.jpg";
import Navbar from "../components/Navbar";
import { FaTimes, FaCheck } from "react-icons/fa";

// Profile Data Array
const SwipingPage = () => {
    const [profiles, setProfiles] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);


    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/get_matches_users/", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("Fetched swipes:", data);
                    setProfiles(data);
                } else {
                    console.error("Error fetching swipes:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching swipes:", error);
            }
        };

        fetchMatches();
    }, []);

    // Handle Swiping (Next Profile)
    const handleNo = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1));

    };

    const handleYes = (caseid2) => {
        console.log("case id 2", caseid2)
        setCurrentIndex((prevIndex) => (prevIndex + 1));

        const accessToken = localStorage.getItem("access_token");

        fetch('http://127.0.0.1:8000/api/swipes_right/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                caseid2: caseid2
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update swiped status');
                }
                return response.json();
            })
            .then(data => {
                console.log("Successfully updated swiped:", data);
            })
            .catch(error => console.error('Error updating swiped:', error));
    };

    // Get the current profile
    const profile = profiles[currentIndex];

    console.log(profile);

    let profilePhotoSource;
    if (profile && profile.profile_photo && profile.media_url) {
        profilePhotoSource = `${profile.media_url}${profile.profile_photo}`;
    } else {
        profilePhotoSource = profilePic;
    }

    if (profiles.length === 0) {
        return (
            <div className="d-flex flex-column min-vh-100">
                <Navbar />
                <Container fluid className="d-flex flex-grow-1 justify-content-center align-items-center">
                    <div className="d-flex flex-column align-items-center gap-3">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <h1 className="h3 custom-txt">Loading...</h1>
                    </div>
                </Container>
            </div>
        );
    }
    else if (currentIndex >= profiles.length) {
        return (
            <div className="d-flex flex-column min-vh-100">
                <Navbar />
                <Container fluid className="d-flex flex-grow-1 justify-content-center align-items-center">
                    <h1 className="h3 custom-txt">Out of Matches!</h1>
                </Container>
            </div>
        );
    }

    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />

            {/* Swiping Container */}
            <Container fluid className="d-flex flex-grow-1 justify-content-center align-items-center">
                <Row className="w-75 align-items-center">

                    {/* Reject Button */}
                    <Col xs={2} className="text-center">
                        <Button variant="secondary" className="rounded-circle p-4" onClick={handleNo}>
                            <FaTimes size={32} />
                        </Button>
                    </Col>

                    {/* Profile Card */}
                    <Col xs={8}>
                        <Card className="p-4 border-0 shadow d-flex flex-row align-items-center">
                            {/* Image Section */}
                            <Col md={5} className="text-center">
                                {/*<Image*/}
                                {/*    src={profile.image}*/}
                                {/*    rounded*/}
                                {/*    fluid*/}
                                {/*    className="border border-primary p-1"*/}
                                {/*    style={{ maxWidth: "300px", height: "auto", borderRadius: "10px" }}*/}
                                {/*    alt="Profile"*/}
                                {/*/>*/}
                                {/*<p className="text-muted mt-2">matched • {profile.id}</p>*/}
                                <Image
                                    src={profilePhotoSource}
                                    rounded
                                    fluid
                                    className="border border-primary p-1"
                                    style={{ maxWidth: "250px", height: "auto", borderRadius: "10px" }}
                                    alt="Profile"
                                />
                            </Col>

                            {/* Info Section */}
                            <Col md={7}>
                                <h3><strong>{profile.name}, {profile.age}</strong></h3>
                                <h5 className="custom-txt"><strong>{profile.matchPercentage}% Match</strong></h5>

                                <p><strong>Grade:</strong> {profile.grade}</p>
                                <p><strong>Major:</strong> {profile.major}</p>
                                <p><strong>Dorm Preference:</strong> {profile.dorms.join(", ")}</p>

                                <hr />

                                <p><strong>Wakes up at:</strong> {profile.wakeup}</p>
                                <p><strong>Sleeps at:</strong> {profile.sleepTime}</p>
                                <p><strong>Noise Level:</strong> {profile.noise}</p>
                                <p><strong>Messiness:</strong> {profile.messiness}</p>

                                <p><strong>Guests in Room:</strong> {profile.guests}</p>
                                <p><strong>In Room:</strong> {profile.inRoom}</p>
                                {/*<p><strong>Goes Out:</strong> {profile.goesOut}</p>*/}
                            </Col>
                        </Card>
                    </Col>

                    {/* Accept Button */}
                    <Col xs={2} className="text-center">

                        <button className="rounded-circle p-4 custom-btn" onClick={() => handleYes(profile.caseid)}>
                            <FaCheck size={32} />
                        </button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default SwipingPage;
