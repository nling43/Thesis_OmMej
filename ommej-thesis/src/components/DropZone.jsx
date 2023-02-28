import React, { useMemo } from "react";
import { useDropzone } from "react-dropzone";
import Button from "react-bootstrap/Button";
import "../css/DropZone.css";

import { shallow } from "zustand/shallow";
import "reactflow/dist/style.css";
import useStore from "../Store/store";

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
	const handleUpload = () => {
		const reader = new FileReader();
		reader.onload = function (e) {
			const contents = e.target.result;
			const json = JSON.parse(contents);
			const questions = json.questions;
			Object.entries(questions).forEach(([id, data]) => {
				const question = {
					id: id,
					data: data,
					position: { x: 0, y: 0 },
					type: "Question",
				};
				const answers = data.answers;
				Object.entries(answers).forEach(([id, data]) => {
					const answer = {
						id: id,
						data: data,
						position: { x: 0, y: 0 },
						type: data.type,
					};
					const edgeFromQuestion = {
						id: question.id + id,
						source: question.id,
						target: id,
					};
					const edgeFromAnswer = {
						id: id + data.next,
						source: id,
						target: data.next,
					};
					edges.push(edgeFromQuestion);
					edges.push(edgeFromAnswer);
					nodes.push(answer);
				});

				nodes.push(question);
			});
			onNodesChange(edges);
			onNodesChange(nodes);
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
