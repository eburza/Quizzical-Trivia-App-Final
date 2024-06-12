import React from "react";
import WelcomePage from "./components/WelcomePage";
import QuizzPage from "./components/QuizzPage";
import he from "he";
import { nanoid } from "nanoid";

export default function App() {
    const [gameStarted, setGameStarted] = React.useState(false);
    const [allQuestions, setAllQuestions] = React.useState([]);
    const [questionsLoaded, setQuestionsLoaded] = React.useState(false);
    const [checkAnswer, setCheckAnswer] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [newGame, setNewGame] = React.useState(false);
    const [counter, setCounter] = React.useState(0);
    const [selectedAnswers, setSelectedAnswers] = React.useState(new Map());

    // WelcomePage
    function startQuiz() {
        setGameStarted(true);
        fetchQuizData();
    }

    // Shuffle answers
    function shuffleAnswers(array) {
        if (!Array.isArray(array)) {
            console.error("shuffleAnswers received a non-array:", array);
            return [];
        }
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Fetch quiz data with retry logic
    function fetchQuizData(retries = 3, delay = 2000) {
        fetch("https://opentdb.com/api.php?amount=5")
            .then(res => res.json())
            .then(data => {
                if (data.response_code !== 0) {
                    throw new Error(`API error: ${data.response_code}`);
                }
                const decodedData = data.results.map(item => {
                    let answers;
                    if (item.type === "boolean") {
                        answers = ["True", "False"];
                    } else {
                        answers = shuffleAnswers([
                            he.decode(item.correct_answer),
                            ...item.incorrect_answers.map(ans => he.decode(ans))
                        ]);
                    }
                    return {
                        singleQuestion: he.decode(item.question),
                        answers: answers,
                        correctAnswer: he.decode(item.correct_answer),
                        questionType: item.type,
                        questionId: nanoid()
                    };
                });
                setAllQuestions(decodedData);
                setQuestionsLoaded(true);
            })
            .catch(err => {
                console.error(err);
                if (retries > 0) {
                    setTimeout(() => fetchQuizData(retries - 1, delay * 2), delay); // Exponential backoff
                } else {
                    setError(err.message);
                }
            });
    }

    function handleAnswerSelect(questionId, answer) {
        setSelectedAnswers(prevState => {
            const newState = new Map(prevState);
            newState.set(questionId, answer);
            return newState;
        });
    }

    function handleCheckAnswer() {
        setCheckAnswer(true);
        setNewGame(true);
        calculateAnswers();
    }

    function calculateAnswers() {
        let count = 0;
        allQuestions.forEach(question => {
            if (selectedAnswers.get(question.questionId) === question.correctAnswer) {
                count++;
            }
        });
        setCounter(count);
    }

    function startNewGame() {
        setGameStarted(false);
        setQuestionsLoaded(false);
        setCheckAnswer(false);
        setNewGame(false);
        setAllQuestions([]);
        setCounter(0);
        setSelectedAnswers(new Map());
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            {gameStarted ? (
                allQuestions.map(question => (
                    <QuizzPage
                        key={question.questionId}
                        question={question.singleQuestion}
                        correctAnswer={question.correctAnswer}
                        answers={question.answers}
                        type={question.questionType}
                        id={question.questionId}
                        onAnswerSelect={handleAnswerSelect} // Pass the function to handle answer selection
                        checkAnswer={checkAnswer}
                    />
                ))
            ) : (
                <WelcomePage startButtonClick={startQuiz} />
            )}
            {questionsLoaded && <button className="button answersCheck" onClick={newGame ? startNewGame : handleCheckAnswer}>
                {newGame ? 'Start New Game' : 'Check Answers'}
            </button>}
            {newGame && <h3 className="coutAnswers">You got {counter} correct answers!</h3>}
        </div>
    );
}
