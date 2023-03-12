function getPrevAnswers(question, edgesFromAnswers, nodesAnswers) {
	const prevAEdge = edgesFromAnswers.filter((el) => el.target === question.id);
	const answers = [];
	prevAEdge.forEach((edge) => {
		answers.push(nodesAnswers.find((el) => el.id === edge.source));
	});
	return answers;
}
function getNextAnswers(question, edgesFromQuestion, nodesAnswers) {
	const nextAEdge = edgesFromQuestion.filter((el) => el.source === question.id);
	const answers = [];
	nextAEdge.forEach((edge) => {
		answers.push(nodesAnswers.find((el) => el.id == edge.target));
	});
	return answers;
}

function getNextQuestions() {}

function placeQuestion(
	question,
	nodesQuestions,
	nodesAnswers,
	edgesFromAnswers,
	edgesFromQuestion
) {
	const prevAnswers = getPrevAnswers(question, edgesFromAnswers, nodesAnswers);
	if (question.id === "897f6b3e-ed1f-40ce-9d24-9c19720547bc") {
		console.log(prevAnswers);
	}
	if (prevAnswers.length === 1) {
		setNodePosition(
			question,
			prevAnswers[0].position.x,
			prevAnswers[0].position.y + 200
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
		const maxY = Math.max(...yPositions);
		prevAnswers.forEach((answer) => {
			answer.position.y = maxY;
		});
		if (question.id === "897f6b3e-ed1f-40ce-9d24-9c19720547bc") {
			console.log(...yPositions);
			console.log(maxY);
		}
		setNodePosition(question, nextX, maxY + 200);
	}
}
function placeAnswers(
	question,
	nodesQuestions,
	nodesAnswers,
	edgesFromAnswers,
	edgesFromQuestion
) {
	let questionPosition = getNodePosition(question);
	const nextAnswers = getNextAnswers(question, edgesFromQuestion, nodesAnswers);

	if (nextAnswers.length === 1) {
		detectCollision(
			questionPosition[0],
			questionPosition[1] + 200,
			nodesAnswers
		);

		setNodePosition(
			nextAnswers[0],
			questionPosition[0],
			questionPosition[1] + 200
		);
	} else if (nextAnswers.length === 2) {
		detectCollision(
			questionPosition[0] - 300,
			questionPosition[1] + 200,
			nodesAnswers
		);
		setNodePosition(
			nextAnswers[0],
			questionPosition[0] - 300,
			questionPosition[1] + 200
		);
		detectCollision(
			questionPosition[0] + 300,
			questionPosition[1] + 200,
			nodesAnswers
		);

		setNodePosition(
			nextAnswers[1],
			questionPosition[0] + 300,
			questionPosition[1] + 200
		);
	} else if (nextAnswers.length >= 10) {
		if (questionPosition[0] - 980 < 0)
			setNodePosition(
				question,
				questionPosition[0] - 1500,
				questionPosition[1]
			);
		else {
			setNodePosition(
				question,
				questionPosition[0] + 1500,
				questionPosition[1]
			);
		}
		questionPosition = getNodePosition(question);

		for (let index = 0; index < nextAnswers.length; index++) {
			const answer = nextAnswers[index];

			const answerX = questionPosition[0] + 1200 * index;
			detectCollision(answerX, questionPosition[1] + 200, nodesAnswers);

			setNodePosition(answer, answerX, questionPosition[1] + 200);
		}
	} else {
		for (let index = 0; index < nextAnswers.length; index++) {
			const answer = nextAnswers[index];
			let posA = index - nextAnswers.length / 2;

			const answerX = questionPosition[0] + 400 * posA;
			detectCollision(answerX, questionPosition[1] + 200, nodesAnswers);

			setNodePosition(answer, answerX, questionPosition[1] + 200);
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
	nodesAnswers,
	edgesFromAnswers,
	edgesFromQuestion,
	elseEdges,
	ifEdges
) {
	const rootX = 980;
	const rootY = 0;
	for (let i = 0; i < nodesQuestions.length; i++) {
		const question = nodesQuestions[i];
		if (i === 0) {
			setNodePosition(question, rootX, rootY);
			placeAnswers(
				question,
				nodesQuestions,
				nodesAnswers,
				edgesFromAnswers,
				edgesFromQuestion
			);
		} else {
			placeQuestion(
				question,
				nodesQuestions,
				nodesAnswers,
				edgesFromAnswers,
				edgesFromQuestion
			);
			placeAnswers(
				question,
				nodesQuestions,
				nodesAnswers,
				edgesFromAnswers,
				edgesFromQuestion
			);
		}
	}
}
