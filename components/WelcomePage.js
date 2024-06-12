import React from "react"

export default function WelcomePage(props) {
    return (
        <div className="welcome-page">
            <h1 className="quiz-name">Quizzical</h1>
            <p className="quiz-intro">It is an engaging game where you can test your knowledge across various topics. 
                Each question presents four possible answers, but only one is correct. 
                Sharpen your mind, compete with friends, and see how many questions you can get right. 
                <br/> <br/>
                <span className="quiz-master">Are you ready to become the ultimate QuizMaster?</span></p>
            <button className="start-game-btn button" onClick={props.startButtonClick}>Start quiz</button>
        </div>
    )
}