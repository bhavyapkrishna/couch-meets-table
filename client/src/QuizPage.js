import React from "react";

const QuizPage = () => (
  <div className="flex flex-col items-center p-10">
    <h1 className="text-xl font-bold">How clean do you keep your room?</h1>
    <input type="range" className="mt-4" />
  </div>
);

export default QuizPage;