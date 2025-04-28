import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card, Image, Button } from "react-bootstrap";
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

    const handleYes = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1));

    };

    // Get the current profile
    const profile = profiles[currentIndex];

    if (!profile) {
        return <div>Loading...</div>;
    }

    if (currentIndex >= profiles.length) {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <Container fluid className="d-flex flex-grow-1 justify-content-center align-items-center">
                <h2>Out of Matches!</h2>
            </Container>
        </div>
    );

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
                            </Col>

                            {/* Info Section */}
                            <Col md={7}>
                                <h3><strong>{profile.name}, {profile.age}</strong></h3>
                                <h5 className="text-primary"><strong>{profile.matchPercentage}%</strong></h5>

                                <p><strong>Grade:</strong> {profile.grade}</p>
                                <p><strong>Major:</strong> {profile.major}</p>
                                <p><strong>Dorm Preference:</strong> {profile.dorms}</p>

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
                        <Button variant="primary" className="rounded-circle p-4" onClick={handleYes}>
                            <FaCheck size={32} />
                        </Button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default SwipingPage;
