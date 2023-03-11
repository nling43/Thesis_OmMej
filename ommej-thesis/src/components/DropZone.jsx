import React, { useMemo } from "react";
import ELK from "elkjs";
import { useDropzone } from "react-dropzone";
import Button from "react-bootstrap/Button";
import "../css/DropZone.css";
import { hierarchy, tree, cluster } from "d3-hierarchy";
import { shallow } from "zustand/shallow";
import "reactflow/dist/style.css";
import useStore from "../Store/store";
import dagre from "dagre";

export default function DropZone() {
	const selector = (state) => ({
		nodes: state.nodes,
		onNodesChange: state.onNodesChange,
		edges: state.edges,
		onEdgesChange: state.onEdgesChange,
	});
	const { nodes, onNodesChange, edges, onEdgesChange } = useStore(
		selector,
		shallow
	);

	const {
		acceptedFiles,
		fileRejections,
		getRootProps,
		getInputProps,
		isDragAccept,
		isDragReject,
	} = useDropzone({ accept: { "application/json": [] } });

	var acceptedFileItems;
	if (acceptedFiles.length === 0) {
		acceptedFileItems = (
			<p>Drag and drop your file here, or click to select file</p>
		);
	} else {
		acceptedFileItems = acceptedFiles.map((file) => (
			<p key={file.path}>{file.name}</p>
		));
	}

	const baseStyle = {
		flex: 1,
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		paddingBlock: "0.5rem",
		marginTop: "4rem",
		marginInline: "auto",
		borderWidth: 2,
		borderRadius: 8,
		borderColor: "#fff",
		borderStyle: "dashed",
		backgroundColor: "rgb(87, 86, 86)",
		color: "#fff",
		outline: "none",
		fontSize: "1.5rem",
		transition: "border .24s ease-in-out",
	};

	const acceptStyle = {
		backgroundColor: "#00e676",
	};

	const rejectStyle = {
		backgroundColor: "#ff1744",
	};
	const style = useMemo(
		() => ({
			...baseStyle,
			...(isDragAccept ? acceptStyle : {}),
			...(isDragReject ? rejectStyle : {}),
		}),
		[isDragAccept, isDragReject]
	);

	function getPrevAnswers(question, edgesFromAnswers, nodesAnswers) {
		const prevAEdge = edgesFromAnswers.filter(
			(el) => el.target === question.id
		);
		const answers = [];
		prevAEdge.forEach((edge) => {
			answers.push(nodesAnswers.find((el) => el.id === edge.source));
		});
		return answers;
	}
	function getNextAnswers(question, edgesFromQuestion, nodesAnswers) {
		const nextAEdge = edgesFromQuestion.filter(
			(el) => el.source === question.id
		);
		const answers = [];
		nextAEdge.forEach((edge) => {
			answers.push(nodesAnswers.find((el) => el.id == edge.target));
		});
		return answers;
	}

	function placeQuestion(
		question,
		nodesQuestions,
		nodesAnswers,
		edgesFromAnswers,
		edgesFromQuestion
	) {
		const prevAnswers = getPrevAnswers(
			question,
			edgesFromAnswers,
			nodesAnswers
		);

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
			nextX = centralizeX(nextX);

			const yPositions = prevAnswers.map((answer) => answer.position.y);
			const maxY = Math.max(...yPositions);
			prevAnswers.forEach((answer) => {
				answer.position.y = maxY;
			});
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
		const questionPosition = getNodePosition(question);
		const nextAnswers = getNextAnswers(
			question,
			edgesFromQuestion,
			nodesAnswers
		);

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
		node.position.x = x;
		node.position.y = y;
	}

	function centralizeX(x) {
		return x + 200 / 2;
	}

	function detectCollision(x, y, nodes) {
		return nodes.find((el) => el.position.x === x && el.position.y === y);
	}

	function layout(
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
			console.log(question);
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
	const handleUpload = () => {
		const reader = new FileReader();
		reader.onload = function (e) {
			const nodesQuestions = [];
			const nodesAnswers = [];
			const contents = e.target.result;
			const json = JSON.parse(contents);
			const edgesFromQuestions = [];
			const edgesFromAnswers = [];
			const ifEdges = [];
			const elseEdges = [];
			const questions = json.questions;
			Object.entries(questions).forEach(([id, data]) => {
				data.id = id;
				const question = {
					id: id,
					data: data,
					position: { x: 0, y: -900 },
					type: "Question",
				};
				if (!!data.includeIf) {
					data.includeIf.answers.forEach((element) => {
						const ifEdge = {
							id: "if " + id + " " + element,
							source: id,
							target: element,
							style: { stroke: "green" },
						};
						ifEdges.push(ifEdge);
					});
					const elseEdge = {
						id: "else " + id + " " + data.includeIf.else,
						source: id,
						target: data.includeIf.else,
						style: { stroke: "red" },
					};
					elseEdges.push(elseEdge);
				}
				const answers = data.answers;
				Object.entries(answers).forEach(([id, data]) => {
					data.id = id;

					const answer = {
						id: id,
						data: data,
						position: { x: 0, y: -900 },
						type: "answer_" + data.type,
					};

					const edgeFromQuestion = {
						id: "fromQ " + question.id + " " + id,
						source: question.id,
						target: id,
					};

					if (!!data.next) {
						const edgeFromAnswer = {
							id: "fromA " + id + " " + data.next,
							source: id,
							target: data.next,
						};
						edgesFromAnswers.push(edgeFromAnswer);
					}
					edgesFromQuestions.push(edgeFromQuestion);
					nodesAnswers.push(answer);
				});
				nodesQuestions.push(question);
			});

			layout(
				nodesQuestions,
				nodesAnswers,
				edgesFromAnswers,
				edgesFromQuestions,
				elseEdges,
				ifEdges
			);

			nodes.push(...nodesQuestions);
			nodes.push(...nodesAnswers);
			edges.push(...edgesFromAnswers);
			edges.push(...edgesFromQuestions);
			edges.push(...ifEdges);
			edges.push(...elseEdges);
			onNodesChange(nodes);
			onEdgesChange(edges);
		};

		acceptedFiles.forEach((file) => {
			reader.readAsText(file);
		});
	};

	return (
		<>
			<div className="container">
				<div {...getRootProps({ style })}>
					<input {...getInputProps()} />

					<div> {acceptedFileItems}</div>
				</div>
			</div>
			<div className="buttonContainer">
				<Button className="button" variant="primary" onClick={handleUpload}>
					Load
				</Button>
			</div>
		</>
	);
}
