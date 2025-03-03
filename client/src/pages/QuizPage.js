import {useState} from "react";

const questions = [
  "When do you usually wake up?",
  "When do you usually sleep?",
  "How quiet would you like your room to be?",
  "How clean would you like your room to be?",
  "How often do you have guests?",
  "How often will you be in your room?",
  "How often do you go out?",
];

const QuizPage = () => {
    const [responses, setResponses] = useState(
        questions.map(() => ({ self: 3, ideal: 3, important: false }))
    );
    const [currentQuestion, setCurrentQuestion] = useState(0);

    const handleChange = (type, value) => {
        const updatedResponses = [...responses];
        updatedResponses[currentQuestion][type] = value;
        setResponses(updatedResponses);
    };

    const nextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            alert("Quiz completed!");
        }
    };

    const prevQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    return (
        <div className="container-fluid vh-100 d-flex flex-column align-items-center pt-5">
            <h1 className="h3 custom-txt">Roommate Quiz</h1>
            <p>{questions[currentQuestion]}</p>

            <label className="mt-3">Your preference (1-5): {responses[currentQuestion].self}</label>
            <input
                type="range"
                min="1"
                max="5"
                value={responses[currentQuestion].self}
                onChange={(e) => handleChange("self", Number(e.target.value))}
                className="w-50"
            />

            <label className="d-block mt-3">Ideal roommate’s preference (1-5): {responses[currentQuestion].ideal}</label>
            <input
                type="range"
                min="1"
                max="5"
                value={responses[currentQuestion].ideal}
                onChange={(e) => handleChange("ideal", Number(e.target.value))}
                className="w-50"
            />

            <label className="mt-3">
                <input
                    type="checkbox"
                    checked={responses[currentQuestion].important}
                    onChange={(e) => handleChange("important", e.target.checked)}
                />
                This preference is important to me
            </label>

            <div>
                {currentQuestion > 0 && <Button onClick={prevQuestion}>Back</Button>}
                <Button onClick={nextQuestion}>{currentQuestion === questions.length - 1 ? "Finish" : "Next"}</Button>
            </div>
        </div>
    );
};

export default QuizPage;