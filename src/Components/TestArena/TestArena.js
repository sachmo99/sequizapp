import React, { Component } from 'react';
import './TestArena.css';
import cookie from 'react-cookies';

import Question from './Question/Question';
import Timer from './Timer/Timer';
import 'react-notifications/lib/notifications.css';
import sekalu from "../../static/sekalu.jpg";

class TestArena extends Component {

	state = { answers: {} }

	onAnswer = (quesCode, ans) => {
		var temp = this.state.answers;
		temp[quesCode] = ans;
		this.setState({ answers: temp });
	}

	submitQuiz = () => {
		var marks = 0;
		var questions = this.state.questions;
		var answers = this.state.answers;
		var correctAnss = {};
		var isCorrect = {};
		for (let i = 0; i < questions.length; i++) {
			var ques = questions[i];
			var quesCode = ques['questionCode'];
			isCorrect[quesCode] = (answers[quesCode] === ques['correctAns']);
			correctAnss[quesCode] = ques['correctAns'];
			if (answers[quesCode] === ques['correctAns']) {
				marks += 1;
			}
		}
		var quizResult = JSON.stringify({
			username: cookie.load('username', { path: '/sequizapp' }),
			QuizInfo: {
				quizCode: cookie.load('quizCode', { path: '/sequizapp' }),
				correctAns: correctAnss,
				isCorrect : isCorrect,
				answers: answers,
				marks: marks,
				prvQuiz: true
			}
		});
		console.log(quizResult);


		var ipaddress = cookie.load('ipaddress');
		fetch(`${ipaddress}/submitQuiz?quizResult=${quizResult}`, {
			method: 'GET',
		}).then(res => res.json());
		alert('Your Answers have been submitted successfully '+window.location.origin);
		window.location.href = 'http://sachmo99.github.io/sequizapp/#/dashboard';
		cookie.remove('quizCode', { path: '/sequizapp' });
	}

	constructor(props) {
		super(props);

		var quizCode = cookie.load('quizCode', { path: '/sequizapp' })
		if (quizCode === undefined) {
			setTimeout(()=>{
			window.location.href = 'http://sachmo99.github.io/sequizapp/#/dashboard';
			alert('You can\'t hack this.. Test has already been submitted');
			},500);
		}
		else {
			var ipaddress = cookie.load('ipaddress');
		fetch(`${ipaddress}/getTestQuestions?quizCode=${quizCode}`, {
				method: 'GET',
			}).then(res => res.json())
				.then(quiz => this.setState({ questions: quiz.questions, course: quiz.course, topic: quiz.topic }, function () {
					// console.log(this.state.questions);
				}))
		}


	}
	render() {
		// console.log(this.state);
		return (
			<div>
				{
					cookie.load('quizCode', { path: '/sequizapp' }) !== undefined ?
						<div id="pageMargin">
							<div id="Timer">
								<div id="header" >
									<Timer submitQuiz={this.submitQuiz} />
								</div>
								<div id="title">
									<h2 className="courseHeader">{this.state.course}</h2>
									<h3 className="topicHeader">{this.state.topic}</h3>
									<div id="EndTestButton">
										<button onClick={this.submitQuiz}
											class="btn btn-lg btn-danger">End Test</button>
									</div>
								</div>
							</div>

							{
								this.state.questions ?
									this.state.questions.map(ques => {
										return <Question question={ques} onSelectAns={this.onAnswer} />
									})
									: null
							}
						</div> :
						<div>
							<img src={sekalu} alt="Italian Trulli" id="sekalu"></img>
						</div>
				}
			</div>
		);
	}
}

export default TestArena;