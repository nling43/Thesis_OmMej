import useStore from "../Store/store";
import ReactFlow, { Panel } from "reactflow";
import { shallow } from "zustand/shallow";
import styled, { ThemeProvider } from "styled-components";
import "../css/sidebar.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState } from "react";

const selector = (state) => ({
	selected: state.selectedNodes,
	instance: state.reactFlowInstance,
});

const PanelsStyled = styled(Panel)`
	background-color: ${(props) => props.theme.panelBg};
	color: ${(props) => props.theme.panelColor};
	border: 1px solid ${(props) => props.theme.panelBorder};
	width: 400px;
	height: 100%;
	margin: 0;
`;

const questionType = [
	"single",
	"persons",
	"article_text",
	"multiple",
	"frequency",
	"accommodations",
	"single_accommodation",
	"single_person",
	"multiple_person",
];

function sideBarForSingularQuestion(selected) {
	return (
		<Panel className="sidebar" position="top-right">
			<h5>{selected.nodes[0].id}</h5>
			<Form>
				<Form.Group className="mb-3" controlId="type">
					<Form.Label>Question Type</Form.Label>

					<Form.Select>
						<option>{selected.nodes[0].data.type}</option>
						{questionType.map((type) => (
							<option>{type}</option>
						))}
					</Form.Select>
				</Form.Group>

				<Form.Group className="mb-3" controlId="text">
					<Form.Label>Question Text</Form.Label>
					<Form.Control
						as="textarea"
						rows={selected.nodes[0].data.text.sv.length / 60}
						type="text"
						value={selected.nodes[0].data.text.sv}
					/>
				</Form.Group>

				<Button variant="primary" type="save">
					Save
				</Button>
			</Form>
		</Panel>
	);
}
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
	console.log(id);
	const node = nodes.find((node) => node.id === id);
	console.log(node.position);
	instance.setCenter(node.position.x + 450, node.position.y, { zoom: 0.7 ,duration : 2000});
	console.log(instance.getViewport());
}
function multi(nodes, instance) {
	return (
		<Panel className="sidebar" position="top-right">
			{nodes.map((node) => (
				<Button
					key={node.id}
					id={node.id}
					className="nodeButton"
					onClick={(event) => moveToNode(event.target.id, instance, nodes)}
				>
					{nodeButton(node)}
				</Button>
			))}
		</Panel>
	);
}

function nodeButton(node) {
	if (node.data.type.includes("article")) {
		return node.data.header !== undefined ? (
			<div>
				<p>{node.id}</p> <p>{node.data.header.sv} </p>
				<p>{node.data.type}</p>
			</div>
		) : (
			<div>
				<p>{node.id}</p>
				<p>{node.data.text.sv.substring(0, 60)} </p>
				<p>{node.data.type}</p>
			</div>
		);
	} else if (!node.type.includes("answer")) {
		return (
			<div>
				<p>{node.id}</p> <p>{node.data.text.sv} </p> <p>{node.data.type}</p>
			</div>
		);
	} else {
		<div>
			<p>{node.id}</p> <p>{node.data.type}</p>
		</div>;
	}
}


export function SideBar() {
	const { selected, instance } = useStore(selector, shallow);

	if (
		selected.nodes &&
		selected.nodes.length === 1 &&
		selected.nodes[0].type.includes("question_")
	) {
		return sideBarForSingularQuestion(selected);
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
