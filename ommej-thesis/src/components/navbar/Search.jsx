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
				result = questions.filter((question) =>
					question.data.text.sv.toLowerCase().includes(search.toLowerCase())
				);
				break;

			case 2:
				result = questions.filter(
					(question) =>
						question.data.text.sv.toLowerCase() === search.toLowerCase()
				);
				break;
			case 3:
				result = questions.filter((question) =>
					question.data.type
						.toLowerCase()
						.replace("_", " ")
						.includes(search.toLowerCase())
				);

				break;

			case 4:
				result = questions.filter(
					(question) =>
						question.data.type.toLowerCase().replace("_", " ") ===
						search.toLowerCase()
				);
				break;

			case 5:
				result = nodes.filter((node) => {
					return (
						node.data.tags != undefined &&
						node.data.tags.some((tag) =>
							tag.toLowerCase().includes(search.toLowerCase())
						)
					);
				});
				break;
			case 6:
				result = nodes.filter((node) => {
					return (
						node.data.tags != undefined &&
						node.data.tags.some(
							(tag) => tag.toLowerCase() === search.toLowerCase()
						)
					);
				});
				break;
			case 7:
				result = nodes.filter((node) => node.id.includes(search.toLowerCase()));
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
		edges.forEach((edge) => {
			edge.selected = false;
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
						Question Text Match Exact
					</Dropdown.Item>
					<Dropdown.Item onClick={() => handleSearch(3)}>
						Question Type
					</Dropdown.Item>
					<Dropdown.Item onClick={() => handleSearch(4)}>
						Question Type Match Exact
					</Dropdown.Item>
					<Dropdown.Item onClick={() => handleSearch(5)}>Tags</Dropdown.Item>
					<Dropdown.Item onClick={() => handleSearch(6)}>
						Tags Match Exact
					</Dropdown.Item>

					<Dropdown.Item onClick={() => handleSearch(7)}>Node ID</Dropdown.Item>
				</Dropdown.Menu>
			</Dropdown>
		</>
	);
}
