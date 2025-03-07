import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card, Image } from "react-bootstrap";
import Navbar from "../components/Navbar";
import profilePic from "../assets/images/SampleProfilePic.webp";

const ProfilePage = () => {
    return (
        <div className="min-vh-100 d-flex flex-column overflow-hidden">
            <Navbar />

            {/* Profile */}
            <Container fluid className="d-flex flex-grow-1 justify-content-center align-items-center">
                <Card className="p-4 border-0 shadow w-75 d-flex flex-row">
                    <Row className="align-items-center w-100">
                        {/* Image */}
                        {/*TEMP*/}
                        <Col md={4} className="text-center">
                            <Image
                                src={profilePic}
                                rounded
                                fluid
                                className="border border-primary p-1"
                                style={{ maxWidth: "300px", height: "auto" }}
                                alt="Profile"
                            />
                        </Col>

                        {/* Info */}
                        {/*TEMP*/}
                        <Col md={8}>
                            <h3><strong>Mikayla, 19</strong></h3>
                            <p><strong>Grade:</strong> Sophomore</p>
                            <p><strong>Major:</strong> Bio, Pre-Med</p>
                            <p><strong>Dorm Preference:</strong> Staley, Tippit</p>

                            <hr />

                            <p><strong>Wakes up at:</strong> 6:00 AM</p>
                            <p><strong>Sleeps at:</strong> 10:00 PM</p>
                            <p><strong>Noise Level:</strong> Very quiet</p>
                            <p><strong>Messiness:</strong> Very clean</p>

                            <p><strong>Guests in Room:</strong> Never</p>
                            <p><strong>In Room:</strong> Always</p>
                            <p><strong>Goes Out:</strong> Never</p>

                            <p><strong>Study Habits:</strong> Every night, in room</p>
                            <p><strong>Politics:</strong> Liberal</p>
                        </Col>
                    </Row>
                </Card>
            </Container>
        </div>
    );
};

export default ProfilePage;
