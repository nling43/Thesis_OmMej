import { v4 as uuidv4 } from "uuid";

export function answerTemplate(type, position, quantity) {
	const answers = [];
	for (let index = 0; index < quantity; index++) {
		answers.push(
			createAnswer(type, { x: position.x + 200 * index, y: position.y })
		);
	}
	return answers;
}

export function questionTemplate(type, position, quantity) {
	const answers = answerTemplate(
		"answer_text",
		{
			x: position.x,
			y: position.y + 300,
		},
		quantity
	);

	const firstXPos = answers[0].position.x;
	const lastXPos = answers[answers.length - 1].position.x;
	const newX = (firstXPos + lastXPos) / 2;
	const question = createQuestion(type, { x: newX, y: position.y });

	for (const answer of answers) {
		question.data.answers[answer.id] = answer.data;
	}

	const edges = createEdges(question, answers);
	const nodes = [question, ...answers];
	return [nodes, edges];
}

export function specialQuestionTemplate(type, position) {
	let answers = [];
	switch (type) {
		case "question_article_text":
			answers.push(
				createAnswer("answer_none", {
					x: position.x,
					y: position.y + 300,
				})
			);
			break;

		case "question_accommodations":
			answers.push(
				createAnswer("answer_accommodations", {
					x: position.x + 200,
					y: position.y + 300,
				})
			);
			answers.push(
				createAnswer("answer_text", {
					x: position.x - 200,
					y: position.y + 300,
				})
			);
			break;

		case "question_persons":
			answers.push(
				createAnswer("answer_persons", {
					x: position.x + 200,
					y: position.y + 300,
				})
			);
			answers.push(
				createAnswer("answer_text", {
					x: position.x - 200,
					y: position.y + 300,
				})
			);
			break;

		default:
			answers.push(
				createAnswer("answer_text", {
					x: position.x + 200,
					y: position.y + 300,
				})
			);
			answers.push(
				createAnswer("answer_text", {
					x: position.x - 200,
					y: position.y + 300,
				})
			);
			break;
	}

	const question = createQuestion(type, position);

	for (const answer of answers) {
		question.data.answers[answer.id] = answer.data;
	}

	const edges = createEdges(question, answers);
	const nodes = [question, ...answers];
	return [nodes, edges];
}

function createQuestion(type, position) {
	const question = {
		id: uuidv4(),
		type: type,
		position,
		data: {
			type: type.replace("question_", ""),
			text: {
				sv: "",
			},
			answers: {},
		},
	};
	return question;
}

function createEdges(question, answers) {
	const edges = [];
	for (const answer of answers) {
		edges.push({
			id: "fromQ " + question.id + " " + answer.id,
			source: question.id,
			target: answer.id,
			type: "edges_new",
		});
	}
	return edges;
}

function createAnswer(type, position) {
	const answer = {
		id: uuidv4(),
		type: type,

		position,
		data: {
			type: type.replace("answer_", ""),
			next: null,
		},
	};
	if (type === "answer_text") {
		answer.data.text = {
			sv: "",
		};
	}
	return answer;
}
