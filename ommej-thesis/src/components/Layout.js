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
	const prevElseEdge = elseEdges.filter((el) => el.target === question.id);
	console.log(prevIfEdge);
	const prevAnswers = [];
	prevAEdge.forEach((edge) => {
		prevAnswers.push(answers.find((el) => el.id === edge.source));
	});
	if (prevAnswers.length === 0) {
		prevIfEdge.forEach((edge) => {
			prevAnswers.push(answers.find((el) => el.id === edge.source));
		});
		prevElseEdge.forEach((edge) => {
			prevAnswers.push(questions.find((el) => el.id === edge.source));
		});
		console.log(prevAnswers);
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

function placeQuestion(question) {
	const prevAnswers = getPrevAnswers(question);
	const margin = nodeWidth;
	const bigMargin = doubleNodeHeight;

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
		nextX = centralizeX(nextX);
		const yPositions = prevAnswers.map((answer) => answer.position.y);
		let maxY = Math.max(...yPositions);

		prevAnswers.forEach((answer) => {
			if (!isColliding(answer.position.x, maxY, answers, answer))
				setNodePosition(answer, answer.position.x, maxY);
		});
		if (prevAnswers.length >= 5) {
			maxY = maxY + bigMargin;
		}
		setNodePosition(question, nextX, maxY + margin);
	}
}
function placeAnswers(question) {
	let questionPosition = getNodePosition(question);
	const nextAnswers = getNextAnswers(question);
	let margin = nodeWidth + 100;
	const bigMargin = doubleNodeWidth;
	if (getNextQuestions(question).length > 1) margin = bigMargin + 200;
	if (nextAnswers.length === 1) {
		setNodePosition(
			nextAnswers[0],
			questionPosition[0],
			questionPosition[1] + nodeHeight
		);
	} else if (nextAnswers.length === 2) {
		setNodePosition(
			nextAnswers[0],
			centralizeX(questionPosition[0]) - margin,
			questionPosition[1] + nodeHeight
		);

		setNodePosition(
			nextAnswers[1],
			centralizeX(questionPosition[0]) + margin,
			questionPosition[1] + nodeHeight
		);
	} else if (nextAnswers.length >= 10) {
		if (questionPosition[0] < 980)
			setNodePosition(question, questionPosition[0] - 500, questionPosition[1]);
		else {
			setNodePosition(question, questionPosition[0] + 500, questionPosition[1]);
		}
		questionPosition = getNodePosition(question);

		for (let index = 0; index < nextAnswers.length; index++) {
			const answer = nextAnswers[index];

			const answerX = questionPosition[0] + 1200 * index;
			let answerY = questionPosition[1] + nodeHeight;

			setNodePosition(answer, answerX, answerY);
		}
	} else {
		for (let index = 0; index < nextAnswers.length; index++) {
			const answer = nextAnswers[index];
			let posA = index - nextAnswers.length / 2;

			const answerX = questionPosition[0] + margin * posA;
			let answerY = questionPosition[1] + nodeHeight;

			setNodePosition(answer, answerX, answerY);
		}
	}
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
	else return true;
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
}
