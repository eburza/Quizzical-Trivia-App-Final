import React from "react";

export default function QuizzPage(props) {
    const [selectedAnswer, setSelectedAnswer] = React.useState(null);

    const handleAnswerClick = (answer) => {
        if (!props.checkAnswer) {
            setSelectedAnswer(answer);
            props.onAnswerSelect(props.id, answer); // Notify the App component
        }
    };

    const getAnswerStyle = (answer) => {
        const isCorrect = answer === props.correctAnswer;
        const isSelected = answer === selectedAnswer;

        if (!props.checkAnswer) {
            return isSelected ? { backgroundColor: '#D6DBF5' } : {};
        }

        if (isCorrect) {
            return { backgroundColor: '#94D7A2', border: 'transparent' }; // Correct answer
        } else if (isSelected) {
            return { backgroundColor: '#F8BCBC', opacity: 0.5 }; // Incorrect and selected
        } else {
            return { opacity: 0.5 }; // Incorrect and not selected
        }
    };

    return (
        <div className="question-block">
            <h2 className="question">{props.question}</h2>
            <div className="answer-block">
                {props.answers.map((answer, index) => (
                    <div
                        key={index}
                        onClick={() => handleAnswerClick(answer)}
                        className={`answer ${selectedAnswer === answer ? "selected" : ""}`}
                        style={getAnswerStyle(answer)}
                    >
                        {answer}
                    </div>
                ))}
            </div>
        </div>
    );
}
