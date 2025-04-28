import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../UserProvider";
import Navbar from "../components/Navbar";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const MatchesPage = () => {
  const { user } = useContext(UserContext);

  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showModal, setShowModal] = useState(false);

//backend fetching
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/get_matches/", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Fetched matches:", data); 
          setMatches(data);
        } else {
          console.error("Error fetching matches:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching matches:", error);
      }
    };

    fetchMatches();
  }, []);



  const handleNameClick = (match) => {
    setSelectedMatch(match);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedMatch(null);
  };

  console.log("matches", matches)
  if (!matches) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container-fluid vh-100 d-flex flex-column align-items-center pt-5">
      <Navbar />
      <div className="card p-4 text-center mt-5 border-0 custom-bg w-75">
        <h1 className="h3 custom-txt">Your Matches</h1>
        <p>Here are your top roommate matches:</p>

        {/* Table */}
        <div className="table-responsive mt-4">
          <table className="table table-hover text-center">
            <thead>
              <tr>
                <th>Name & Age</th>
                <th>Match %</th>
              </tr>
            </thead>
            <tbody>
              {matches.length === 0 ? (
                <tr>
                  <td colSpan="2">No matches found.</td>
                </tr>
              ) : (
                matches.map((match) => (
                  <tr key={match.id}>
                    <td>
                      <button
                        onClick={() => handleNameClick(match)}
                        className="btn btn-link custom-txt text-decoration-none"
                      >
                        {match.name} (Age: {match.age})
                      </button>
                    </td>
                    <td>
                      <span
                        className={`badge fs-6 ${
                          match.matchPercentage >= 90
                            ? "bg-success"
                            : match.matchPercentage >= 75
                            ? "bg-warning"
                            : "bg-danger"
                        }`}
                      >
                        {match.matchPercentage}%
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        <Modal show={showModal} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>{selectedMatch?.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedMatch && (
                <>
                  <p><strong>Age:</strong> {selectedMatch.age}</p>
                  <p><strong>Major:</strong> {selectedMatch.major}</p>
                  <p><strong>Preferred Dorms:</strong> {selectedMatch.dorms.join(", ")}</p>
                  <p><strong>Bio:</strong> {selectedMatch.bio}</p>
                  <p><strong>Wake Up Time:</strong> {selectedMatch.wakeup}</p>
                  <p><strong>Sleep Time:</strong> {selectedMatch.sleepTime}</p>
                  <p><strong>Noise Level:</strong> {selectedMatch.noise}</p>
                  <p><strong>Messiness:</strong> {selectedMatch.messiness}</p>
                  <p><strong>Guests in Room:</strong> {selectedMatch.guests}</p>
                  <p><strong>In Room:</strong> {selectedMatch.inRoom}</p>
                </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default MatchesPage;