import useStore from "../../Store/store";
import { shallow } from "zustand/shallow";
import { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";

const selector = (state) => ({
	nodes: state.nodes,
	edges: state.edges,
	onEdgesChange: state.onEdgesChange,

	setShowAddNode: state.setShowAddNode,
	onNodesChange: state.onNodesChange,
});

export default function Search() {
	const { nodes, setShowAddNode, onNodesChange, onEdgesChange, edges } =
		useStore(selector, shallow);
	const [search, setSearch] = useState("");

	function handleDefualt(e) {
		e.preventDefault();
		handleSearch(1, search);
	}

	function handleSearch(number) {
		setShowAddNode(false);
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
				break;
			case 3:
				result = nodes.filter((node) => node.id.includes(search.toLowerCase()));
				break;

			case 4:
				result = nodes.filter(
					(node) =>
						node.data.tags != undefined &&
						node.data.tags.includes(search.toUpperCase())
				);
				break;
			default:
				console.log("Error");
		}
		select(result);
	}

	function select(toSelect) {
		nodes.forEach((node) => {
			node.selected = false;
		});
		toSelect.forEach((fromResult) => {
			const nodeToSelect = nodes.find(
				(element) => element.id === fromResult.id
			);
			nodeToSelect.selected = true;
			const connectedEdges = edges.filter(
				(el) => el.source === nodeToSelect.id || el.target === nodeToSelect.id
			);
			for (let i = 0; i < connectedEdges.length; i++) {
				connectedEdges[i].selected = true;
			}
			onEdgesChange(connectedEdges);
		});

		onNodesChange(nodes);
	}
	return (
		<>
			<Form className="d-flex" onSubmit={(e) => handleDefualt(e)}>
				<Form.Control
					type="search"
					placeholder="Search"
					className="Search"
					aria-label="Search"
					onChange={(e) => setSearch(e.target.value.trim())}
				/>
			</Form>
			<Dropdown>
				<Dropdown.Toggle variant="success" id="dropdown-basic">
					Search By
				</Dropdown.Toggle>
				<Dropdown.Menu>
					<Dropdown.Item onClick={() => handleSearch(1)}>
						Question Text
					</Dropdown.Item>
					<Dropdown.Item onClick={() => handleSearch(2)}>
						Question Type
					</Dropdown.Item>
					<Dropdown.Item onClick={() => handleSearch(3)}>Node ID</Dropdown.Item>
					<Dropdown.Item onClick={() => handleSearch(4)}>Tags</Dropdown.Item>
				</Dropdown.Menu>
			</Dropdown>
		</>
	);
}
