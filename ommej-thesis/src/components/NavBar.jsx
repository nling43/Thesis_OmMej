import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
// Search bar amd drop down button
import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";
//Search icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "../css/NavBar.css";
import useStore from "../Store/store";
import { shallow } from "zustand/shallow";
import { useState } from "react";
import { saveAs } from "file-saver";
const selector = (state) => ({
	onClear: state.onClear,
	onEdgesChange: state.onEdgesChange,
	//Get all node
	nodes: state.nodes,
	selectedNodes: state.selectedNodes,
	onSelectNodes: state.onSelectNodes,
});

export default function NavBar() {
	const { onClear, nodes, onSelectNodes, selectedNodes } = useStore(
		selector,
		shallow
	);
	const [search, setSearch] = useState("");
	const [showFileNamer, setShowFileNamer] = useState(false);
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
		const questionFormated = questions.reduce((acc, question) => {
			acc[question.id] = question.data;
			return acc;
		}, {});

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
	function handleDefualt(e) {
		e.preventDefault();
		handleSearch(1, search);
	}
	function handleSearch(number, search) {
		let result = [];
		const questions = nodes.filter((node) => node.type.includes("question"));
		switch (number) {
			case 1:
				if (search.includes('"')) {
					const searchWithoutSign = search.replaceAll('"', "");
					result = questions.filter(
						(question) =>
							question.data.text.sv.toLowerCase() ===
							searchWithoutSign.toLowerCase()
					);
				} else {
					result = questions.filter((question) =>
						question.data.text.sv.toLowerCase().includes(search.toLowerCase())
					);
				}
				onSelectNodes({ nodes: result, edges: [] });
				break;
			case 2:
				if (search.includes('"')) {
					const searchWithoutSign = search.replaceAll('"', "");
					result = questions.filter(
						(question) =>
							question.data.type.toLowerCase() ===
							searchWithoutSign.toLowerCase()
					);
				} else {
					result = questions.filter((question) =>
						question.data.type.toLowerCase().includes(search.toLowerCase())
					);
				}
				onSelectNodes({ nodes: result, edges: [] });
				break;
			case 3:
				result = nodes.filter((node) => node.id.includes(search.toLowerCase()));
				onSelectNodes({ nodes: result, edges: [] });
				break;

			case 4:
				result = nodes.filter(
					(node) =>
						node.data.tags != undefined &&
						node.data.tags.includes(search.toUpperCase())
				);
				onSelectNodes({ nodes: result, edges: [] });
				break;
			default:
				console.log("Error");
		}
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
						Import File
					</Button>
					<Button
						className="button"
						variant="outline-primary"
						onClick={() => handleShow()}
					>
						Export File
					</Button>{" "}
				</Nav>
				<Nav>
					<Form className="d-flex" onSubmit={(e) => handleDefualt(e)}>
						<Form.Control
							type="search"
							placeholder="Search"
							className="Search"
							aria-label="Search"
							onChange={(e) => setSearch(e.target.value)}
						/>
					</Form>
					<Dropdown>
						<Dropdown.Toggle variant="success" id="dropdown-basic">
							Search By
						</Dropdown.Toggle>
						<Dropdown.Menu>
							<Dropdown.Item onClick={() => handleSearch(1, search)}>
								Question Text
							</Dropdown.Item>
							<Dropdown.Item onClick={() => handleSearch(2, search)}>
								Question Type
							</Dropdown.Item>
							<Dropdown.Item onClick={() => handleSearch(3, search)}>
								Node ID
							</Dropdown.Item>
							<Dropdown.Item onClick={() => handleSearch(4, search)}>
								Tags
							</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
					<Button className="button" variant="primary">
						Create Question
					</Button>{" "}
					<Button className="button" variant="primary">
						Delete Question
					</Button>
					{""}
				</Nav>
			</Navbar>

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
