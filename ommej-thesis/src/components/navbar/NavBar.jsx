import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
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
} from "@fortawesome/free-solid-svg-icons";
import Search from "./Search.jsx";
import Delete from "./Delete.jsx";
import UndoRedo from "./UndoRedo.jsx";

const selector = (state) => ({
	onClear: state.onClear,
	onEdgesChange: state.onEdgesChange,
	nodes: state.nodes,
	edges: state.edges,
	onNodesChange: state.onNodesChange,
	setShowAddNode: state.setShowAddNode,
	showAddNode: state.showAddNode,
});

export default function NavBar() {
	const {
		onClear,
		nodes,
		edges,
		setShowAddNode,
		showAddNode,
		onNodesChange,
		onEdgesChange,
	} = useStore(selector, shallow);
	const [showFileNamer, setShowFileNamer] = useState(false);
	const [fileName, setFileName] = useState("");
	const [showImportModal, setShowImportModal] = useState(false);

	const handleClose = () => setShowFileNamer(false);
	const handleShow = () => {
		if (nodes.length > 0) setShowFileNamer(true);
	};
	const handleImport = () => {
		setShowImportModal(true);
	};

	const removeNodesForImport = () => {
		onClear();
		setShowImportModal(false);
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

		saveAs(fileToSave, fileName);
	};

	function handleAddButtonClick() {
		for (let i = 0; i < nodes.length; i++) {
			nodes[i].selected = false;
		}
		for (let i = 0; i < edges.length; i++) {
			edges[i].selected = false;
		}
		onEdgesChange(edges);
		onNodesChange(nodes);
		setShowAddNode(!showAddNode);
	}
	function handleDefualt(e) {
		e.preventDefault();
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
						variant={showAddNode ? "primary" : "outline-primary"}
						onClick={() => {
							handleAddButtonClick();
						}}
					>
						<FontAwesomeIcon icon={faPlus} />
					</Button>{" "}
				</Nav>
				<Delete />
				<UndoRedo />
			</Navbar>

			<Modal show={showFileNamer} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Download File</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={(e) => handleDefualt(e)}>
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

			<Modal show={showImportModal} onHide={() => setShowImportModal(false)}>
				<Modal.Header closeButton>
					<Modal.Title>
						Clear current questions and answers, to import new file
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					This will remove all questions/answers and changes. This can not be
					undone
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowImportModal(false)}>
						Cancel
					</Button>
					<Button variant="danger" onClick={() => removeNodesForImport()}>
						Continue
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}
