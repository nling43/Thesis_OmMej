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

export function SideBar() {
	const { selected } = useStore(selector, shallow);
	if (
		selected.nodes &&
		selected.nodes.length === 1 &&
		selected.nodes[0].type.includes("question_")
	) {
		return sideBarForSingularQuestion(selected);
	} else if (selected.nodes && selected.nodes.length > 1) {
		return (
			<PanelsStyled position="top-right">
				{selected.nodes.map((node) =>
					typeof node.data.text.sv !== "undefined" ? (
						<button>{node.data.text.sv}</button>
					) : (
						<button>{node.data.id}</button>
					)
				)}
			</PanelsStyled>
		);
	} else {
		console.log(selected);
		return <></>;
	}
}
