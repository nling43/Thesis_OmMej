import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
// Search bar amd drop down button
import Dropdown from "react-bootstrap/Dropdown";
//Search icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "../css/NavBar.css";
import useStore from "../Store/store";
import { shallow } from "zustand/shallow";
import { useState } from "react";

const selector = (state) => ({
	onClear: state.onClear,
	onEdgesChange: state.onEdgesChange,
	//Get all node
	nodes: state.nodes,
	selectedNodes: state.selectedNodes,
	onSelectNodes: state.onSelectNodes,
});

export default function NavBar() {
	const { onClear, onEdgesChange, nodes, onSelectNodes, selectedNodes } =
		useStore(selector, shallow);
	const [search, setSearch] = useState("");
	const handleImport = () => {
		console.log("test");
		onClear();
		onEdgesChange([]);
	};

	function handleSearch(number, search) {
		switch (number) {
			case 1:
				const questions = nodes.filter((node) =>
					node.type.includes("question")
				);
				const result_question = questions.filter((question) =>
					question.data.text.sv.includes(search)
				);
				console.log(result_question.length);

				onSelectNodes({ nodes: result_question, edges: [] });
				console.log(selectedNodes);
				break;
			case 2:
				const types = nodes.filter((node) => node.type.includes("question"));
				const result_types = types.filter((type) =>
					type.data.type.includes(search)
				);
				console.log(result_types.length);
				onSelectNodes({ nodes: result_types, edges: [] });
				console.log(selectedNodes);
				break;
			case 3:
				const result = nodes.filter((node) => node.id.includes(search));
				console.log(result.length);
				onSelectNodes({ nodes: result, edges: [] });
				console.log(selectedNodes);
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
					<Button className="button" variant="outline-primary">
						Export File
					</Button>{" "}
				</Nav>
				<Nav>
					<Form className="d-flex">
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
								Question
							</Dropdown.Item>
							<Dropdown.Item onClick={() => handleSearch(2, search)}>
								Question Type
							</Dropdown.Item>
							<Dropdown.Item onClick={() => handleSearch(3, search)}>
								Node ID
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
		</>
	);
}
