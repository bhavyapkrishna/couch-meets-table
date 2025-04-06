import {useContext} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card, Image } from "react-bootstrap";
import Navbar from "../components/Navbar";
import profilePic from "../assets/images/SampleProfilePic.webp";
import { UserContext } from "../UserProvider";

const ProfilePage = () => {
    const { user } = useContext(UserContext);

    console.log("User data:", user);
    console.log("Quiz responses:", user.quizResponse);
    
    if (!user || !user.profile || !user.quizResponse) {
        return (
            <div className="container">
                <h2>Loading...</h2>
                <p>Your profile is still being set up. Please try again later.</p>
            </div>
        );
    }

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
                            <h3><strong>{user.profile.first_name} {user.profile.last_name}, {user.profile.age}</strong></h3>
                            <p><strong>Grade:</strong> {user.profile.grade}</p>
                            <p><strong>Major:</strong> {user.profile.major}</p>
                            <p><strong>Dorm Preference:</strong> {user.profile.dorms}</p>
                            <p><strong>Bio:</strong> {user.profile.bio}</p>

                            <hr />

                            <p><strong>Wakes up at:</strong> {user.quizResponse[0]?.self?.label || "Can't find"}</p>
                            <p><strong>Sleeps at:</strong> {user.quizResponse[1]?.self?.label || "Can't find"}</p>
                            <p><strong>Noise Level:</strong> {user.quizResponse[2]?.self?.label || "Can't find"}</p>
                            <p><strong>Messiness:</strong> {user.quizResponse[3]?.self?.label || "Can't find"}</p>

                            <p><strong>Guests in Room:</strong> {user.quizResponse[4]?.self?.label || "Can't find"}</p>
                            <p><strong>In Room:</strong> {user.quizResponse[5]?.self?.label || "Can't find"}</p>
                        </Col>
                    </Row>
                </Card>
            </Container>
        </div>
    );
};

export default ProfilePage;
