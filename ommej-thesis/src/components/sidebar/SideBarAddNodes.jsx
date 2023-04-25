import { Panel } from "reactflow";
import "../../css/sidebar.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import useStore from "../../Store/store";
import { shallow } from "zustand/shallow";

const selector = (state) => ({
	setShowAddNode: state.setShowAddNode,
	setselectedEdgeType: state.setselectedEdgeType,
	selectedEdgeType: state.selectedEdgeType,
});
export default function SideBarAddNodes() {
	const { setShowAddNode, setselectedEdgeType, selectedEdgeType } = useStore(
		selector,
		shallow
	);
	const onDragStart = (event, nodeType) => {
		event.dataTransfer.setData("application/reactflow", nodeType);
		event.dataTransfer.effectAllowed = "move";
	};
	const commonTypes = [
		"frequency",
		"multiple",
		"multiple_person",
		"single",
		"single_accommodation",
		"single_person",
	];
	const specialTypes = ["article_text", "accommodations", "persons"];

	const answersTypes = ["text", "persons", "accommodations", "none"];
	return (
		<Panel className="sidebar" position="top-right">
			<h5 className="title">Edge</h5>
			<div>
				<Form.Group className="mb-3" controlId="type">
					<Form.Select
						value={selectedEdgeType}
						onChange={(event) => {
							setselectedEdgeType(event.target.value);
						}}
					>
						<option key={1}>{"Default"}</option>
						<option key={2}>{"IncludeIf"}</option>
						<option key={3}>{"Else"}</option>
					</Form.Select>
				</Form.Group>
			</div>

			<h5 className="title">Common Questions</h5>
			<div className="addNodeGrid">
				{commonTypes.map((type, index) => (
					<div
						key={index}
						className="addNode"
						onDragStart={(event) => onDragStart(event, "question_" + type)}
						draggable
					>
						{(type.charAt(0).toUpperCase() + type.slice(1)).replace(/_/g, " ")}
					</div>
				))}
			</div>

			<h5 className="title">Special Questions</h5>
			<div className="addNodeGrid">
				{specialTypes.map((type, index) => (
					<div
						key={index}
						className="addNode"
						onDragStart={(event) => onDragStart(event, "question_" + type)}
						draggable
					>
						{(type.charAt(0).toUpperCase() + type.slice(1)).replace(/_/g, " ")}
					</div>
				))}
			</div>
			<h5 className="title">Answers</h5>
			<div className="addNodeGrid">
				{answersTypes.map((type, index) => (
					<div
						key={index}
						className="addNode"
						onDragStart={(event) => onDragStart(event, "answer_" + type)}
						draggable
					>
						{type.charAt(0).toUpperCase() + type.slice(1)}
					</div>
				))}
			</div>
		</Panel>
	);
}
