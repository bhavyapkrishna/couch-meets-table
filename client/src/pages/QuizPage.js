import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { UserContext } from "../UserProvider";

// quiz questions with labels
const questions = [
  {
    text: "When do you usually wake up?",
    labels: ["Early", "", "Average", "", "Late"]
  },
  {
    text: "When do you usually sleep?",
    labels: ["Early", "", "Average", "", "Late"]
  },
  {
    text: "How quiet would you like your room to be?",
    labels: ["Silent", "", "Average", "", "Lively"]
  },
  {
    text: "How clean would you like your room to be?",
    labels: ["Clean", "", "Lived-in", "", "Messy"]
  },
  {
    text: "How often do you have guests?",
    labels: ["Rarely", "", "Sometimes", "", "Always"]
  },
  {
    text: "How often will you be in your room?",
    labels: ["Rarely", "", "Sometimes", "", "Always"]
  },
];

const QuizPage = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [responses, setResponses] = useState(
    questions.map((q) => ({
      self: { value: 3, label: q.labels[2] }, //default
      ideal: { value: 3, label: q.labels[2] },
      important: false
    }))
  );

  const [currentQuestion, setCurrentQuestion] = useState(0);

  // updating response values
  const handleChange = (type, value) => {
    const label = questions[currentQuestion].labels[value - 1] || 'N/A';
    const updatedResponses = [...responses];
    if (type === "important") {
      updatedResponses[currentQuestion].important = value;
    } else {
      updatedResponses[currentQuestion][type] = { value, label };
    }
    setResponses(updatedResponses);
  };

  // next question or end
  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setUser(prev => ({
        ...prev,
        quizResponse: responses
      }));
      navigate("/createProfile");
    }
  };

  // go back
  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex flex-column align-items-center pt-5">
      <Navbar />

      {/* quiz card */}
      <div className="card p-4 text-center mt-5 border-0 custom-bg">
        <h1 className="h3 custom-txt">Roommate Quiz</h1>
        <p> Question {currentQuestion + 1}: {questions[currentQuestion].text}</p>

        {/* self */}
        <p>Your preference: </p>
        <div className="card p-4 text-center border-0 custom-bg flex-row justify-content-center">
          {questions[currentQuestion].labels.map((label, index) => (
            <div key={index} className="text-center mx-4">
              <input
                type="radio"
                name="self"
                value={index + 1}
                checked={responses[currentQuestion].self?.value === index + 1}
                onChange={() => handleChange("self", index + 1, label)}
              />
              <div className="mt-1">{label && <small>{label}</small>}</div>
            </div>
          ))}
        </div>

        {/* ideal roommate */}
        <p>Ideal roommate's preference: </p>
        <div className="card p-4 text-center border-0 custom-bg flex-row justify-content-center">
          {questions[currentQuestion].labels.map((label, index) => (
            <div key={index} className="text-center mx-4">
              <input
                type="radio"
                name="ideal"
                value={index + 1}
                checked={responses[currentQuestion].ideal?.value === index + 1}
                onChange={() => handleChange("ideal", index + 1, label)}
              />
              <div className="mt-1">{label && <small>{label}</small>}</div>
            </div>
          ))}
        </div>

        {/* dealbreaker checkbox */}
        <label className="mt-3">
          <input
            type="checkbox"
            checked={responses[currentQuestion].important}
            onChange={(e) => handleChange("important", e.target.checked)}
          />
          This preference is important to me
        </label>

        {/* navigation buttons */}
        <div>
          {currentQuestion > 0 && <button onClick={prevQuestion} className="custom-btn">Back</button>}
          <button onClick={nextQuestion} className="custom-btn">{currentQuestion === questions.length - 1 ? "Finish" : "Next"}</button>

        </div>
      </div>
    </div>
  );
};

export default QuizPage;