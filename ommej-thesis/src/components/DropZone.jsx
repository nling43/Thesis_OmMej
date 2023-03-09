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
		let inlineMargin = 300;

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
				const centerX = qx + 200 / 2;
				const centerY = qy + 200 / 2;

				// find a node where the center point is inside
				const targetNodes = nodesquestions.filter(
					(n) =>
						centerX > n.position.x - inlineMargin &&
						centerX < n.position.x + 200 + inlineMargin &&
						centerY > n.position.y &&
						centerY < n.position.y + 200 &&
						n.id !== question.id
				);
				if (targetNodes.length > 0) {
					console.log(targetNodes);

					for (let j = 0; j < targetNodes.length; j++) {
						const target = targetNodes[j];
						const align = j - targetNodes.length / 2;

						target.position.x =
							target.position.x + inlineMargin * Math.trunc(align);
					}
				}
			}

			const answersToCurrentQuestion = edgesFromQuestion.filter(
				(el) => el.source === question.id
			);

			if (answersToCurrentQuestion.length === 1) {
				const answerId = answersToCurrentQuestion[0].target;
				const answer = nodesanswers.find((el) => el.id === answerId);
				answer.position.x = qx + 200 / 2;
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
				if (answersToCurrentQuestion.length > 4) {
					qx = qx * 3;
					question.position.x = qx;
				}
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
					const answer = {
						id: id,
						data: data,
						position: { x: 0, y: -900 },
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
