import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card, Image, Button } from "react-bootstrap";
import Navbar from "../components/Navbar";
import { FaTimes, FaCheck } from "react-icons/fa";

const profiles = [
    {
        id: 1,
        name: "Angela",
        age: 19,
        matchPercentage: "80%",
        major: "Computer Science",
        grade: "Sophomore",
        dorm: "Alumni, Tippit",
        wakesUp: "7:00 AM",
        sleepsAt: "11:00 PM",
        noiseLevel: "Pretty quiet",
        messiness: "Pretty clean",
        guests: "Barely",
        inRoom: "Always",
        goesOut: "Never",
        image: "/assets/images/SampleMatchingPic.webp"
    },
    {
        id: 2,
        name: "Mike",
        age: 20,
        matchPercentage: "85%",
        major: "Mechanical Engineering",
        grade: "Junior",
        dorm: "Tippit, Alumni",
        wakesUp: "6:30 AM",
        sleepsAt: "12:00 AM",
        noiseLevel: "Moderate",
        messiness: "Slightly messy",
        guests: "Sometimes",
        inRoom: "Usually",
        goesOut: "Occasionally",
        image: "/assets/images/SampleMatchingPic2.webp"
    }
];

const SwipingPage = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const handleSwipe = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % profiles.length);
    };

    const profile = profiles[currentIndex];

    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />

            <Container fluid className="d-flex flex-grow-1 justify-content-center align-items-center">
                <Row className="w-75 align-items-center">

                    {/* Reject Button */}
                    <Col xs={2} md={1} className="text-center">
                        <Button variant="secondary" className="rounded-circle p-3" onClick={handleSwipe}>
                            <FaTimes size={24} />
                        </Button>
                    </Col>

                    {/* Profile Card */}
                    <Col xs={8} md={10}>
                        <Card className="p-4 border-0 shadow">
                            <Card.Body>
                                <Row className="d-flex flex-column flex-md-row align-items-center">

                                    {/* Image Section */}
                                    <Col xs={12} md={5} className="text-center">
                                        <Image
                                            src={profile.image}
                                            rounded
                                            fluid
                                            className="border border-primary p-1"
                                            style={{ maxWidth: "300px", height: "auto", borderRadius: "10px" }}
                                            alt="Profile"
                                        />
                                        <p className="text-muted mt-2">matched • {profile.id}</p>
                                    </Col>

                                    {/* Info Section */}
                                    <Col xs={12} md={7} className="mt-3 mt-md-0">
                                        <h3><strong>{profile.name}, {profile.age}</strong></h3>
                                        <h5 className="text-primary"><strong>{profile.matchPercentage} Match</strong></h5>

                                        <p><strong>Grade:</strong> {profile.grade}</p>
                                        <p><strong>Major:</strong> {profile.major}</p>
                                        <p><strong>Dorm Preference:</strong> {profile.dorm}</p>

                                        <hr />

                                        <p><strong>Wakes up at:</strong> {profile.wakesUp}</p>
                                        <p><strong>Sleeps at:</strong> {profile.sleepsAt}</p>
                                        <p><strong>Noise Level:</strong> {profile.noiseLevel}</p>
                                        <p><strong>Messiness:</strong> {profile.messiness}</p>

                                        <p><strong>Guests in Room:</strong> {profile.guests}</p>
                                        <p><strong>In Room:</strong> {profile.inRoom}</p>
                                        <p><strong>Goes Out:</strong> {profile.goesOut}</p>
                                    </Col>

                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Accept Button */}
                    <Col xs={2} md={1} className="text-center">
                        <Button variant="primary" className="rounded-circle p-3" onClick={handleSwipe}>
                            <FaCheck size={24} />
                        </Button>
                    </Col>

                </Row>
            </Container>
        </div>
    );
};

export default SwipingPage;
