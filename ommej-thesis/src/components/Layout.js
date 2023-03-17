// todo !
// fix so it doesnt need 2 passes, reason for it is we follow the flow of the json but json is only one dimension, first pass gets weird when the answers hasnt been initialized with anything yet, should follow the flow for edges instead
//fix so the layout uses the if else edges to decide the layout somehow.

let questions = [];
let answers = [];
let edgesFromAnswers = [];
let edgesFromQuestion = [];
let elseEdges = [];
let ifEdges = [];

const rootX = 980;
const rootY = 0;

const nodeHeight = 200;
const nodeWidth = 200;
const doubleNodeWidth = 2 * nodeWidth;
const doubleNodeHeight = 2 * nodeHeight;

function getPrevAnswers(question) {
	const prevAEdge = edgesFromAnswers.filter((el) => el.target === question.id);
	const prevIfEdge = ifEdges.filter((el) => el.target === question.id);
	const prevAnswers = [];
	prevAEdge.forEach((edge) => {
		prevAnswers.push(answers.find((el) => el.id === edge.source));
	});
	if (prevAnswers.length === 0) {
		prevIfEdge.forEach((edge) => {
			prevAnswers.push(answers.find((el) => el.id === edge.source));
		});
	}

	return prevAnswers;
}
function getNextAnswers(question) {
	const nextQEdge = edgesFromQuestion.filter((el) => el.source === question.id);
	const nextanswers = [];
	nextQEdge.forEach((edge) => {
		if (typeof edge != "undefined") {
			nextanswers.push(answers.find((el) => el.id == edge.target));
		}
	});
	return nextanswers;
}

function getNextQuestions(question) {
	const nextQEdge = edgesFromQuestion.filter((el) => el.source === question.id);
	const nextanswers = [];
	const nextquestions = new Set();

	const nextAEdge = [];
	nextQEdge.forEach((edge) => {
		nextAEdge.push(edgesFromAnswers.find((el) => el.source === edge.target));
		nextanswers.push(answers.find((el) => el.id == edge.target));
	});
	if (nextAEdge.length > 0)
		nextAEdge.forEach((edge) => {
			if (typeof edge != "undefined") {
				const nextQ = questions.find((el) => el.id == edge.target);
				nextquestions.add(nextQ);
			}
		});
	return [...nextquestions];
}

function getPrevQuestions(question) {
	const prevAEdge = edgesFromAnswers.filter((el) => el.target === question.id); // get answer edges where target is the question
	const prevQuestions = new Set();
	const prevQEdge = [];
	prevAEdge.forEach((edge) => {
		prevQEdge.push(edgesFromQuestion.find((el) => el.target === edge.sorce)); // push edges where the prev answer is the target
	});
	if (prevAEdge.length > 0)
		prevAEdge.forEach((edge) => {
			const nextQ = questions.find((el) => el.id == edge.source);
			prevQuestions.add(nextQ);
		});
	return [...prevQuestions];
}
function placeQuestion(question) {
	const prevAnswers = getPrevAnswers(question);

	if (prevAnswers.length === 1) {
		setQuestion(
			prevAnswers[0].position.x,
			prevAnswers[0].position.y + doubleNodeHeight,
			questions,
			question
		);
	} else {
		let nextX = 0;

		prevAnswers.forEach((element) => {
			nextX = nextX + element.position.x;
		});
		nextX = Math.round(nextX / prevAnswers.length);
		const yPositions = prevAnswers.map((answer) => answer.position.y);
		let maxY = Math.max(...yPositions);

		/*
		this was used to get all the answers to a question on the same level close to the next question without it answers from a question is close to the current question
		
		prevAnswers.forEach((answer) => {
			if (!isColliding(answer.position.x, maxY, answers, answer))
				setNodePosition(answer, answer.position.x, maxY);
		});
		*/
		if (prevAnswers.length > 6) {
			maxY = maxY + doubleNodeHeight * 2;
		}
		maxY = maxY + doubleNodeHeight;

		setQuestion(nextX, maxY, questions, question);
	}
}
function placeAnswers(question) {
	let questionPosition = getNodePosition(question);
	const nextAnswers = getNextAnswers(question);
	let margin = nodeWidth + 300;
	const bigMargin = doubleNodeWidth;
	if (getNextQuestions(question).length > 1) margin = bigMargin + 200;
	if (nextAnswers.length === 1) {
		setAnswer(
			questionPosition[0],
			questionPosition[1] + doubleNodeHeight,
			answers,
			nextAnswers[0],
			questionPosition[0]
		);
	} else if (nextAnswers.length === 2) {
		setAnswer(
			questionPosition[0] - nodeWidth,
			questionPosition[1] + doubleNodeHeight,
			answers,
			nextAnswers[0],
			questionPosition[0]
		);

		setAnswer(
			questionPosition[0] + doubleNodeWidth,
			questionPosition[1] + doubleNodeHeight,
			answers,
			nextAnswers[1],
			questionPosition[0]
		);
	} else if (
		nextAnswers.length >= 10 &&
		getNextQuestions(question).length > 3
	) {
		if (questionPosition[0] < 980)
			setNodePosition(question, questionPosition[0] - 500, questionPosition[1]);
		else {
			setNodePosition(question, questionPosition[0] + 500, questionPosition[1]);
		}
		questionPosition = getNodePosition(question);

		for (let index = 0; index < nextAnswers.length; index++) {
			const answer = nextAnswers[index];

			const answerX = questionPosition[0] + 1800 * index;
			let answerY = questionPosition[1] + doubleNodeHeight;

			setAnswer(answerX, answerY, answers, answer, questionPosition[0]);
		}
	} else if (nextAnswers.length % 2 == 0) {
		for (let index = 0; index < nextAnswers.length; index++) {
			const answer = nextAnswers[index];
			let posA = index - nextAnswers.length / 2 + 0.25;

			const answerX = questionPosition[0] + margin * Math.trunc(posA);
			let answerY = questionPosition[1] + doubleNodeHeight;

			setAnswer(answerX, answerY, answers, answer, questionPosition[0]);
		}
	} else {
		for (let i = 0; i < nextAnswers.length; i++) {
			const answer = nextAnswers[i];

			let posA = i - nextAnswers.length / 2 + 0.5;

			const answerX = questionPosition[0] + margin * posA;
			let answerY = questionPosition[1] + doubleNodeHeight;

			setAnswer(answerX, answerY, answers, answer, questionPosition[0]);
		}
	}
}

function setAnswer(answerX, answerY, answers, answer, questionX) {
	let x = answerX;
	let y = answerY;
	while (isColliding(x, y, answers, answer)) {
		if (questionX > answerX) {
			x = x + 10;
		} else {
			x = x - 10;
		}
	}
	setNodePosition(answer, x, y);
}
function setQuestion(qX, qY, questions, question) {
	let x = qX;
	let y = qY;
	while (isColliding(x, y, questions, question)) {
		if (x > rootX) {
			x = x + 1000;
		} else {
			x = x - 1000;
		}
	}
	setNodePosition(question, x, y);
}

function getNodePosition(node) {
	return [node.position.x, node.position.y];
}
function setNodePosition(node, x, y) {
	node.position.x = x;
	node.position.y = y;
}

function centralizeX(x) {
	return x + 200 / 2;
}

function isColliding(x, y, nodes, node) {
	const collision = nodes.find(
		(node) =>
			(x >= node.position.x &&
				x <= node.position.x + nodeWidth &&
				y >= node.position.y &&
				y <= node.position.y + nodeHeight) ||
			(x + 200 >= node.position.x &&
				x + 200 <= node.position.x + nodeWidth &&
				y >= node.position.y &&
				y <= node.position.y + nodeHeight)
	);

	if (typeof collision === "undefined" || node.id === collision.id)
		return false;
	else {
		return true;
	}
}

function setQuestionsOnCurrentDepth(question) {
	const questionOnCurrentDepth = questions.filter(
		(el) => el.position.y === question.position.y
	);
	const sortedXPositions = questionOnCurrentDepth.sort((a, b) => {
		// left to right
		return a.position.x > b.position.x;
	});
	if (questionOnCurrentDepth.length > 2) {
		for (let index = 1; index < sortedXPositions.length; index++) {
			const currentQuestion = sortedXPositions[index];
			const prevQuestion = sortedXPositions[index - 1];
			if (currentQuestion.position.x - prevQuestion.position.x < 2000) {
				currentQuestion.position.x = prevQuestion.position.x + 2000;
				placeAnswers(currentQuestion);
			}
		}

		for (let index = sortedXPositions.length - 1; index > -1; index--) {
			const currentQuestion = sortedXPositions[index];
			placeAnswers(currentQuestion);
		}
	} else if (questionOnCurrentDepth.length === 2) {
		const currentQuestion = sortedXPositions[1];
		const prevQuestion = sortedXPositions[0];
		if (currentQuestion.position.x - prevQuestion.position.x < 2000) {
			currentQuestion.position.x = prevQuestion.position.x + 2000;

			placeAnswers(currentQuestion);
			placeAnswers(prevQuestion);
		}
	}
}

export function layout(
	nodesQuestions,
	nodeAnswers,
	edgesAnswers,
	edgesQuestion,
	fromFileElseEdges,
	fromFileifEdges
) {
	questions = nodesQuestions;
	answers = nodeAnswers;
	edgesFromAnswers = edgesAnswers;
	edgesFromQuestion = edgesQuestion;
	elseEdges = fromFileElseEdges;
	ifEdges = fromFileifEdges;
	for (let i = 0; i < questions.length; i++) {
		const question = questions[i];
		if (i === 0) {
			setNodePosition(question, rootX, rootY);
			placeAnswers(question);
		} else {
			placeQuestion(question);
			placeAnswers(question);
		}
	}
	for (let i = 0; i < questions.length; i++) {
		const question = questions[i];
		if (i === 0) {
			setNodePosition(question, rootX, rootY);
			placeAnswers(question);
		} else {
			placeQuestion(question);
			setQuestionsOnCurrentDepth(question);
			placeAnswers(question);
		}
	}
}
