import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
// Search bar amd drop down button
import Modal from "react-bootstrap/Modal";
import "../../css/NavBar.css";
import useStore from "../../Store/store";
import { shallow } from "zustand/shallow";
import { useState } from "react";
import { saveAs } from "file-saver";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faFileImport,
	faFileExport,
	faPlus,
	faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import Search from "./Search.jsx";

const selector = (state) => ({
	onClear: state.onClear,
	onEdgesChange: state.onEdgesChange,
	//Get all node
	nodes: state.nodes,
	onNodesChange: state.onNodesChange,
	selectedNodes: state.selectedNodes,
	edges: state.edges,
	instance: state.reactFlowInstance,
	setShowAddNode: state.setShowAddNode,
	showAddNode: state.showAddNode,
});

export default function NavBar() {
	const {
		onClear,
		nodes,
		setShowAddNode,
		showAddNode,
		instance,
		selectedNodes,
		onNodesChange,
	} = useStore(selector, shallow);
	const [showFileNamer, setShowFileNamer] = useState(false);
	const [showDelete, setShowDelete] = useState(false);
	const [fileName, setFileName] = useState("");

	const handleClose = () => setShowFileNamer(false);
	const handleShow = () => {
		if (nodes.length > 0) setShowFileNamer(true);
	};
	const handleImport = () => {
		onClear();
	};

	const handleExport = () => {
		handleClose();
		const questions = nodes.filter((node) => node.type.includes("question"));
		questions.sort((a, b) => a.position.y - b.position.y);
		const questionFormated = questions.reduce((acc, question) => {
			acc[question.id] = question.data;
			return acc;
		}, {});
		console.log(nodes);
		const data = {
			metadata: {
				name: "general",
				version: 2,
				firstQuestion: "a601bc68-da0b-47a2-9fdf-c5446f32b2be",
			},
			questions: questionFormated,
		};
		var fileToSave = new Blob([JSON.stringify(data)], {
			type: "application/json",
		});

		// Save the file
		saveAs(fileToSave, fileName);
	};

	function handleAddButtonClick() {
		nodes.forEach((element) => {
			element.selected = false;
		});
		onNodesChange(nodes);
		setShowAddNode(!showAddNode);
	}

	function handleDeleteNodes() {
		const answers = selectedNodes.nodes.filter((el) =>
			el.type.includes("answer")
		);
		const questions = selectedNodes.nodes.filter((el) =>
			el.type.includes("question")
		);

		const edges = selectedNodes.edges;

		if (answers.length === 0 && questions.length === 0 && edges.length === 1) {
			const source = nodes.find((node) => node.id === edges[0].source);
			const target = nodes.find((node) => node.id === edges[0].target);

			if (source.type.includes("question")) {
				console.log("source = question");
				delete source.data.answers[target.id];
			} else {
				console.log("source = answer");

				const question = nodes.find(
					(question) =>
						question.data.answers && source.id in question.data.answers
				);
				if (question !== undefined)
					question.data.answers[source.id].next = null;
				else {
					source.data.next = null;
				}
			}
		}

		answers.forEach((answer) => {
			const question = nodes.find(
				(question) =>
					question.data.answers && answer.id in question.data.answers
			);
			if (question) {
				delete question.data.answers[answer.id];
			}
		});
		questions.forEach((question) => {
			const answers = nodes.filter(
				(answer) => answer.data.next && question.id === answer.data.next
			);

			for (const answer of answers) {
				answer.data.next = null;
			}
		});

		instance.deleteElements(selectedNodes);
		setShowDelete(false);
	}
	return (
		<>
			<Navbar variant="dark" bg="dark">
				<Nav>
					<Button
						className="button"
						variant="outline-primary"
						onClick={() => handleImport()}
					>
						<FontAwesomeIcon icon={faFileImport} />
					</Button>
					<Button
						className="button"
						variant="outline-primary"
						onClick={() => handleShow()}
					>
						<FontAwesomeIcon icon={faFileExport} />
					</Button>{" "}
				</Nav>
				<Nav>
					<Search></Search>
				</Nav>

				<Nav>
					<Button
						className="button"
						variant="primary"
						onClick={() => {
							handleAddButtonClick();
						}}
					>
						<FontAwesomeIcon icon={faPlus} />
					</Button>{" "}
					<Button
						className="button"
						variant="primary"
						onClick={() => {
							setShowDelete(true);
						}}
					>
						<FontAwesomeIcon icon={faTrashCan} />
					</Button>
					{""}
				</Nav>
			</Navbar>
			<Modal show={showDelete} onHide={() => setShowDelete(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Confirmation</Modal.Title>
				</Modal.Header>
				<Modal.Body>Are you sure you want to delete this item?</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowDelete(false)}>
						Cancel
					</Button>
					<Button
						variant="primary"
						onClick={() => {
							handleDeleteNodes();
						}}
					>
						Delete
					</Button>
				</Modal.Footer>
			</Modal>
			<Modal show={showFileNamer} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Download File</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
							<Form.Label>Choose a name</Form.Label>
							<Form.Control
								type="text"
								placeholder="filename.json"
								autoFocus
								onChange={(e) => setFileName(e.target.value)}
							/>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Cancel
					</Button>
					<Button variant="primary" onClick={handleExport}>
						Download
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}
