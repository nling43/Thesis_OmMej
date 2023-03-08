import React, { useMemo } from "react";
import ELK from "elkjs";
import { useDropzone } from "react-dropzone";
import Button from "react-bootstrap/Button";
import "../css/DropZone.css";

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
	const genLayoutDagre = (nodes, edges) => {
		console.log("start layout gen");
		const dagreGraph = new dagre.graphlib.Graph();
		dagreGraph.setDefaultEdgeLabel(() => ({}));
		dagreGraph.setGraph({
			rankdir: "TB",
			acyclicer: "greedy",
			ranker: "tight-tree",
		});

		nodes.forEach((node) => {
			let nodeWidth = 100;
			let nodeHeight = 100;

			dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
		});

		edges.forEach((edge) => {
			dagreGraph.setEdge(edge.source, edge.target);
		});

		dagre.layout(dagreGraph);
		nodes.forEach((node) => {
			const nodeWithPosition = dagreGraph.node(node.id);
			node.position = {
				x: nodeWithPosition.x,
				y: nodeWithPosition.y,
			};
		});
		console.log("finish layout");
	};
	const layout = (
		nodesquestions,
		nodesanswers,
		edgesFromAnswers,
		edgesFromQuestion,
		elseEdges,
		ifEdges
	) => {
		const rootX = 100;
		const rootY = 0;
		const topMargin = 200;
		const inlineMargin = 60;
		let questionsOnCurrentLevel = new Set();
		let questionsOnNextLevel = new Set();
		let startOfCluster = "";
		for (let i = 0; i < nodesquestions.length; i++) {
			const question = nodesquestions[i];
			let qy = 0;
			let qx = 0;
			if (i === 0) {
				question.position.x = rootX;
				question.position.y = rootY;
			} else {
				const prevAnswers = edgesFromAnswers.filter(
					(el) => el.target === question.id
				);
				let totalX = 0;
				let prevY = 0;

				prevAnswers.forEach((edge) => {
					const answer = nodesanswers.find((el) => el.id === edge.source);
					totalX = totalX + answer.position.x;
					if (prevY < answer.position.y) {
						prevY = answer.position.y;
					}
				});
				qx = totalX / prevAnswers.length;
				qy = prevY + topMargin;

				question.position.x = qx;
				question.position.y = qy;

				const questionOnThisLevel = nodesquestions.filter(
					(n) => question.position.y == n.position.y
				);
				if (questionOnThisLevel.length >= 3 && startOfCluster === "")
					startOfCluster = questionOnThisLevel[0];

				if (prevAnswers.length > 10 && startOfCluster !== "") {
					const startNodeIndex = nodesquestions.findIndex(
						(el) => el === startOfCluster
					);
					const endNodeIndex = nodesquestions.findIndex(
						(el) => el === question
					);
					const clusterAnswer = [];

					const clusterQuestion = nodesquestions.slice(
						startNodeIndex,
						endNodeIndex + 1
					);
					const clusterEdges = new Set();
					for (let i = 0; i < clusterQuestion.length - 1; i++) {
						const node = clusterQuestion[i];
						const edges1 = edgesFromQuestion.filter(
							(el) => el.source === node.id
						);
						const edges2 = edgesFromAnswers.filter(
							(el) => el.target === node.id
						);
						edges1.forEach((edge) => {
							const answer = nodesanswers.find((el) => el.id == edge.target);
							clusterAnswer.push(answer);
						});
						clusterEdges.add(...edges1);
						clusterEdges.add(...edges2);
					}

					genLayoutDagre(clusterQuestion, clusterEdges);
					startOfCluster = "";
				}
			}

			const answersToCurrentQuestion = edgesFromQuestion.filter(
				(el) => el.source === question.id
			);
			if (answersToCurrentQuestion.length === 1) {
				const answerId = answersToCurrentQuestion[0].target;
				const answer = nodesanswers.find((el) => el.id === answerId);
				answer.position.x = qx;
				answer.position.y = qy + topMargin;
			} else if (answersToCurrentQuestion.length == 2) {
				let answerId = answersToCurrentQuestion[0].target;
				let answer = nodesanswers.find((el) => el.id === answerId);
				answer.position.x = qx + inlineMargin;
				answer.position.y = qy + topMargin;
				answerId = answersToCurrentQuestion[1].target;
				answer = nodesanswers.find((el) => el.id === answerId);
				answer.position.x = qx - inlineMargin * 2;
				answer.position.y = qy + topMargin;
			} else if (answersToCurrentQuestion.length % 2 == 0) {
				for (let i = 0; i < answersToCurrentQuestion.length; i++) {
					const answerId = answersToCurrentQuestion[i].target;
					const answer = nodesanswers.find((el) => el.id === answerId);

					const align = i - answersToCurrentQuestion.length / 2 + 0.25;

					const ax = qx + inlineMargin * Math.trunc(align);
					const ay = qy + topMargin;
					answer.position.x = ax;
					answer.position.y = ay;
				}
			} else {
				for (let i = 0; i < answersToCurrentQuestion.length; i++) {
					const answerId = answersToCurrentQuestion[i].target;
					const answer = nodesanswers.find((el) => el.id === answerId);

					const align = i - answersToCurrentQuestion.length / 2 + 0.5;

					const ax = qx + inlineMargin * align;
					const ay = qy + topMargin;
					answer.position.x = ax;
					answer.position.y = ay;
				}
			}
		}
	};
	const handleUpload = () => {
		const reader = new FileReader();
		reader.onload = function (e) {
			const nodesquestion = [];
			const nodesanswers = [];
			const contents = e.target.result;
			const json = JSON.parse(contents);
			const edgesFromQuestions = [];
			const edgesFromAnswers = [];
			const ifEdges = [];
			const elseEdges = [];
			const questions = json.questions;

			Object.entries(questions).forEach(([id, data]) => {
				const question = {
					id: id,
					data: data,
					position: { x: 0, y: 0 },
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
					const answer = {
						id: id,
						data: data,
						position: { x: 0, y: -100 },
						type: data.type,
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
					nodesanswers.push(answer);
				});
				nodesquestion.push(question);
			});

			layout(
				nodesquestion,
				nodesanswers,
				edgesFromAnswers,
				edgesFromQuestions,
				elseEdges,
				ifEdges
			);

			nodes.push(...nodesquestion);
			nodes.push(...nodesanswers);
			edges.push(...edgesFromAnswers);
			edges.push(...edgesFromQuestions);
			edges.push(...ifEdges);
			edges.push(...elseEdges);

			//genLayoutDagre(nodes, edges);
			onNodesChange(nodes);
			onEdgesChange(edges);
			console.log("finish upload");
		};

		acceptedFiles.forEach((file) => {
			console.log("start upload");
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
