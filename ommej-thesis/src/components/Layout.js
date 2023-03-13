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

function getPrevAnswers(question) {
	const prevAEdge = edgesFromAnswers.filter((el) => el.target === question.id);
	const prevAnswers = [];
	prevAEdge.forEach((edge) => {
		prevAnswers.push(answers.find((el) => el.id === edge.source));
	});
	return prevAnswers;
}
function getNextAnswers(question) {
	const nextQEdge = edgesFromQuestion.filter((el) => el.source === question.id);
	const nextanswers = [];
	nextQEdge.forEach((edge) => {
		nextanswers.push(answers.find((el) => el.id == edge.target));
	});
	return nextanswers;
}

function getNextQuestions(question) {
	const nextAnswers = getNextAnswers(question);
	const prevAEdge = edgesFromAnswers.filter((el) => el.target === question.id);
}

function placeQuestion(question) {
	const prevAnswers = getPrevAnswers(question);
	if (question.id === "897f6b3e-ed1f-40ce-9d24-9c19720547bc") {
		console.log(prevAnswers);
	}
	if (prevAnswers.length === 1) {
		setNodePosition(
			question,
			prevAnswers[0].position.x,
			prevAnswers[0].position.y + nodeHeight
		);
	} else {
		let nextX = 0;

		prevAnswers.forEach((element) => {
			nextX = nextX + element.position.x;
		});
		nextX = Math.round(nextX / prevAnswers.length);
		console.log(nextX);
		nextX = centralizeX(nextX);

		const yPositions = prevAnswers.map((answer) => answer.position.y);
		let maxY = Math.max(...yPositions);

		prevAnswers.forEach((answer) => {
			answer.position.y = maxY;
		});
		if (prevAnswers.length >= 5) {
			maxY = maxY + nodeHeight;
		}
		setNodePosition(question, nextX, maxY + nodeHeight);
	}
}
function placeAnswers(question) {
	let questionPosition = getNodePosition(question);
	const nextAnswers = getNextAnswers(question);

	if (nextAnswers.length === 1) {
		setNodePosition(
			nextAnswers[0],
			questionPosition[0],
			questionPosition[1] + nodeHeight
		);
	} else if (nextAnswers.length === 2) {
		setNodePosition(
			nextAnswers[0],
			questionPosition[0] - 300,
			questionPosition[1] + nodeHeight
		);

		setNodePosition(
			nextAnswers[1],
			questionPosition[0] + 300,
			questionPosition[1] + nodeHeight
		);
	} else if (nextAnswers.length >= 10) {
		if (questionPosition[0] - 980 < 0)
			setNodePosition(question, questionPosition[0] - 500, questionPosition[1]);
		else {
			setNodePosition(question, questionPosition[0] + 500, questionPosition[1]);
		}
		questionPosition = getNodePosition(question);

		for (let index = 0; index < nextAnswers.length; index++) {
			const answer = nextAnswers[index];

			const answerX = questionPosition[0] + 1200 * index;

			setNodePosition(answer, answerX, questionPosition[1] + nodeHeight);
		}
	} else {
		for (let index = 0; index < nextAnswers.length; index++) {
			const answer = nextAnswers[index];
			let posA = index - nextAnswers.length / 2;

			const answerX = questionPosition[0] + 400 * posA;
			let answerY = questionPosition[1] + nodeHeight;
			while (typeof detectCollision(answerX, answerY, answers) != "undefined") {
				answerY = answerY + nodeHeight;
			}
			setNodePosition(answer, answerX, answerY);
		}
	}
}

function getNodePosition(node) {
	return [node.position.x, node.position.y];
}
function setNodePosition(node, x, y) {
	if (node.id === "897f6b3e-ed1f-40ce-9d24-9c19720547bc") {
		console.log("x", x, " y", y);
	}
	node.position.x = x;
	node.position.y = y;
}

function centralizeX(x) {
	return x + 200 / 2;
}

function detectCollision(x, y, nodes) {
	return nodes.find((el) => el.position.x === x && el.position.y === y);
}

export function layout(
	nodesQuestions,
	nodeAnswers,
	edgesAnswers,
	edgesQuestion,
	elseEdges,
	ifEdges
) {
	questions = nodesQuestions;
	answers = nodeAnswers;
	edgesFromAnswers = edgesAnswers;
	edgesFromQuestion = edgesQuestion;
	elseEdges = elseEdges;
	ifEdges = ifEdges;
	console.log(answers);
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
}
