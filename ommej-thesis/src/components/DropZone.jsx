import React, { useMemo } from "react";
import { useDropzone } from "react-dropzone";
import Button from "react-bootstrap/Button";
import "../css/DropZone.css";
import { shallow } from "zustand/shallow";
import "reactflow/dist/style.css";
import useStore from "../Store/store";
import { layout } from "./Layout.js";
export default function DropZone() {
	const selector = (state) => ({
		nodes: state.nodes,
		onNodesChange: state.onNodesChange,
		edges: state.edges,
		onEdgesChange: state.onEdgesChange,
		setQuestionsTypes: state.setQuestionsTypes,
		setAnswerTypes: state.setAnswerTypes,
	});
	const {
		nodes,
		onNodesChange,
		edges,
		onEdgesChange,
		setQuestionsTypes,
		setAnswerTypes,
	} = useStore(selector, shallow);

	const {
		acceptedFiles,
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
			const dataParameter = new Set();
			const dataAnswerParameter = new Set();
			const dataType = new Set();
			const dataAnswerType = new Set();

			Object.entries(questions).forEach(([id, data]) => {
				const question = {
					id: id,
					data: data,
					position: { x: 0, y: -900 },
					type: "question_" + data.type,
				};
				dataType.add(data.type);
				Object.entries(data).forEach(([parameter, data]) => {
					dataParameter.add(parameter);
				});

				if (!!data.includeIf) {
					data.includeIf.answers.forEach((element) => {
						const ifEdge = {
							id: "if " + id + " " + element,
							source: element,
							target: id,
							type: "edges_if",
						};
						ifEdges.push(ifEdge);
					});
					const elseEdge = {
						id: "else " + id + " " + data.includeIf.else,
						source: id,
						target: data.includeIf.else,
						type: "edges_else",
					};
					elseEdges.push(elseEdge);
				}
				const answers = data.answers;

				Object.entries(answers).forEach(([id, data]) => {
					Object.entries(data).forEach(([parameter, data]) => {
						dataAnswerParameter.add(parameter);
					});
					const answer = {
						id: id,
						data: data,
						position: { x: 0, y: -900 },
						type: "answer_" + data.type,
					};
					dataAnswerType.add(data.type);

					const edgeFromQuestion = {
						id: "fromQ " + question.id + " " + id,
						source: question.id,
						target: id,
						//type: "edge_"+ question.data.type,
						type: "edges_custom",
					};

					if (!!data.next) {
						const edgeFromAnswer = {
							id: "fromA " + id + " " + data.next,
							source: id,
							target: data.next,
							//type: "edge_"+ data.type,
							type: "edges_custom",
						};

						edgesFromAnswers.push(edgeFromAnswer);
					}
					edgesFromQuestions.push(edgeFromQuestion);
					nodesAnswers.push(answer);
				});
				nodesQuestions.push(question);
			});
			setQuestionsTypes(Array.from(dataType).sort());
			setAnswerTypes(Array.from(dataAnswerType).sort());

			console.log(dataParameter);
			console.log(dataAnswerParameter);

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
				<Button
					className="button"
					variant="primary"
					onClick={() => handleUpload()}
				>
					Load
				</Button>
			</div>
		</>
	);
}
