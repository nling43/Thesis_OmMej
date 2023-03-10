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
			marginx: 10,
			marginy: 10,
			nodesep: 10,
			edgesep: 10,
			acyclicer: "greedy",
			ranker: "network-simplex",
		});

		nodes.forEach((node) => {
			let nodeWidth = 100;
			let nodeHeight = 50;
			if (!!node.data.text && node.data.text.sv.length < 50) {
				nodeWidth = node.data.text.sv.length * 10;
			}
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

	const genLayoutElk = (nodes, edges) => {
		console.log("start layout gen");
		const elk = new ELK();
		nodes.forEach((node) => {
			if (!!node.data.text && node.data.text.sv.length < 50) {
				console.log(node);
				node.width = node.data.text.sv.length * 10;
				node.height = 200;
			} else {
				node.height = 200;

				node.width = 100;
			}
		});
		const graph = {
			id: "root",
			layoutOptions: {
				"elk.algorithm": "mrtree",
				"elk.spacing.nodeNode": "25",
			},
			// "elk.algorithm": "layered",
			// "elk.contentAlignment": "V_CENTER",
			// "elk.direction": "RIGHT",
			// "elk.spacing.nodeNode": "25",
			// "elk.layered.spacing.nodeNodeBetweenLayers": "75"
			// "elk.layered.spacing": "50",
			// "elk.spacing": "50"
			// "elk.spacing.individual": "250"
			// "elk.alignment": "RIGHT"
			children: nodes,
			edges: edges,
		};

		elk
			.layout(graph)
			.then(() => {
				nodes.forEach((node) => {
					const nodeWithPosition = graph.children.find(
						(node2) => node.id === node2.id
					);
					node.position = {
						x: nodeWithPosition.x,
						y: nodeWithPosition.y,
					};
				});
				onNodesChange(nodes);
				onEdgesChange(edges);
			})
			.catch(console.error);
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
			const nodeHeight = 100;
			const nodeWidth = 200;
			const margin = 300;
			const rootX = 0;
			const rootY = 0;
			let level = 0;
			let questionOnCurrentLevel = new Set();
			let questionOnNextLevel = new Set();
			console.log(questions)
			Object.entries(questions).forEach(([id, data]) => {
				let x = rootX;
				let y = rootY;
				const posQ = Array.from(questionOnCurrentLevel).findIndex(
					(el) => el === id
				);

				if (level !== 0) {
					const prevEdge = edgesFromAnswers.find((el) => el.target === id);
					const prevAnswer = nodesanswers.find(
						(el) => el.id === prevEdge.source
					);
					if (questionOnCurrentLevel.size == 1) {
						x = rootX;
					} else {
						const posQAllign =
							questionOnCurrentLevel.size / 2 -
							questionOnCurrentLevel.size +
							posQ;

						x = prevAnswer.position.x + nodeWidth * posQAllign;
						console.log(questionOnCurrentLevel.size);
					}
					y = level * margin + nodeHeight;
				}

				const question = {
					id: id,
					data: data,
					position: { x: x, y: y },
					type: "question_"+data.type,
					//if data type = person then add question + person to type
					//if data type = accommodation then add question + accommodation to type
				};
				console.log(question)
				console.log(x, y);
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
				const numberOfAnswers = Object.keys(answers).length;
				let posA = numberOfAnswers / 2 - numberOfAnswers;
				Object.entries(answers).forEach(([id, data]) => {
					const answerX = x + nodeWidth * posA;

					const answer = {
						id: id,
						data: data,
						position: { x: answerX, y: y + 100 + nodeHeight },
						type: "answer_"+data.type,
					};
					console.log(answer)

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
						questionOnNextLevel.add(data.next);
						if (questionOnCurrentLevel.has(data.next)) {
							questionOnCurrentLevel.delete(data.next);
						}
					}
					edgesFromQuestions.push(edgeFromQuestion);
					nodesanswers.push(answer);
					posA++;
				});
				nodesquestion.push(question);
				console.log(questionOnCurrentLevel);
				if (posQ < questionOnCurrentLevel.size || level === 0) {
					level++;

					questionOnCurrentLevel = new Set(questionOnNextLevel);
					questionOnNextLevel = new Set();
				}
			});
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
