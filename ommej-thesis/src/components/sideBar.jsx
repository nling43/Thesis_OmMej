import useStore from "../Store/store";
import { Panel } from "reactflow";
import { shallow } from "zustand/shallow";
import "../css/sidebar.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import styled, { ThemeProvider } from "styled-components";
import SideBarForSingularQuestion from "./SideBarForSingularQuestion.jsx";

const selector = (state) => ({
	selected: state.selectedNodes,
	onNodesChange: state.onNodesChange,
	instance: state.reactFlowInstance,
});

function sideBarForSingularAnswer(selected) {
	return (
		<Panel className="sidebar" position="top-right">
			<h5>{selected.nodes[0].id}</h5>

			<Button variant="primary" type="save">
				Save
			</Button>
		</Panel>
	);
}
function moveToNode(id, instance, nodes) {
	const node = nodes.find((node) => node.id === id);

	instance.setCenter(node.position.x + 450, node.position.y, {
		zoom: 0.7,
	});
}

function nodeButton(node) {
	if (node.data.type.includes("article")) {
		return node.data.header !== undefined ? (
			<div className="NodeButton">
				<p className="id">{node.id}</p>
				<p className="text">{node.data.header.sv} </p>
				<p className="type">{node.data.type}</p>
				{node.data.tags !== undefined ? (
					<div className="tags">
						{node.data.tags.map((type) => (
							<p>{type}</p>
						))}
					</div>
				) : (
					<></>
				)}
			</div>
		) : (
			<div className="NodeButton">
				<p className="id">{node.id}</p>
				<p className="text">{node.data.text.sv.substring(0, 60)} </p>
				<p className="type">{node.data.type}</p>
				{node.data.tags !== undefined ? (
					<div className="tags">
						{node.data.tags.map((type) => (
							<p>{type}</p>
						))}
					</div>
				) : (
					<></>
				)}
			</div>
		);
	} else if (node.type.includes("question")) {
		return (
			<div className="NodeButton">
				<p className="id">{node.id}</p>
				<p className="text">{node.data.text.sv} </p>
				<p className="type">{node.data.type}</p>
				{node.data.tags !== undefined ? (
					<div className="tags">
						{node.data.tags.map((type) => (
							<p>{type}</p>
						))}
					</div>
				) : (
					<></>
				)}
			</div>
		);
	} else {
		return (
			<div>
				<p>{node.id}</p> <p>{node.data.type}</p>
			</div>
		);
	}
}

export function SideBar() {
	const { selected, instance, onNodesChange } = useStore(selector, shallow);

	const MultiButton = styled(Button)`
		color: ${(props) => props.color};
		--bs-btn-border-color: ${(props) => props.color};
		--bs-btn-hover-bg: ${(props) => props.color};
		--bs-btn-hover-color: black;
		--bs-btn-hover-border-color: black;
	`;
	const MultiButtonWrapper = (color, nodes, node, instance) => {
		return (
			<MultiButton
				color={color}
				key={node.id}
				id={node.id}
				className="nodeButton"
				onClick={(event) => moveToNode(event.target.id, instance, nodes)}
				variant="outline-primary"
			>
				{nodeButton(node)}
			</MultiButton>
		);
	};
	function multi(nodes, instance) {
		return (
			<Panel className="sidebar multi" position="top-right">
				{nodes.map((node) => {
					switch (node.data.type) {
						case "single":
							return MultiButtonWrapper(
								(props) => props.theme.questionTextSingle,
								nodes,
								node,
								instance
							);
						case "accommodations":
							return MultiButtonWrapper(
								(props) => props.theme.questionTextAccommodation,
								nodes,
								node,
								instance
							);

						case "article_text":
							return MultiButtonWrapper(
								(props) => props.theme.questionTextArticle,
								nodes,
								node,
								instance
							);
						case "frequency":
							return MultiButtonWrapper(
								(props) => props.theme.questionTextFrequency,
								nodes,
								node,
								instance
							);
						case "multiple":
							return MultiButtonWrapper(
								(props) => props.theme.questionTextMultiple,
								nodes,
								node,
								instance
							);

						case "multiple_person":
							return MultiButtonWrapper(
								(props) => props.theme.questionTextMultiple,
								nodes,
								node,
								instance
							);

						case "persons":
							return MultiButtonWrapper(
								(props) => props.theme.questionTextPersons,
								nodes,
								node,
								instance
							);
						case "single_accommodation":
							return MultiButtonWrapper(
								(props) => props.theme.questionTextSingleAccommodation,
								nodes,
								node,
								instance
							);
						default:
							return MultiButtonWrapper(
								(props) => props.theme.questionTextSingleAccommodation,
								nodes,
								node,
								instance
							);
					}
				})}
			</Panel>
		);
	}

	if (
		selected.nodes &&
		selected.nodes.length === 1 &&
		selected.nodes[0].type.includes("question_")
	) {
		return (
			<SideBarForSingularQuestion
				selected={selected}
				instance={instance}
				onNodesChange={onNodesChange}
			/>
		);
	} else if (selected.nodes && selected.nodes.length > 1) {
		return multi(selected.nodes, instance);
	} else if (
		selected.nodes &&
		selected.nodes.length === 1 &&
		selected.nodes[0].type.includes("answer")
	) {
		return sideBarForSingularAnswer(selected);
	} else {
		return <></>;
	}
}
