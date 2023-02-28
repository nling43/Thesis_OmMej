import React from "react";
import ReactFlow, { MiniMap, Controls, Background } from "reactflow";
import { shallow } from "zustand/shallow";
import styled, { ThemeProvider } from "styled-components";
import { darkTheme } from "../theme";
import "reactflow/dist/style.css";
import "../css/Flow.css";

import useStore from "../Store/store";
import QuestionNode from "./nodes/Question/QuestionNode.jsx";
import AnswerNodeText from "./nodes/Answers/AnswerNodeText.jsx";
import AnswerNodePeople from "./nodes/Answers/AnswerNodePeople.jsx";
import AnswerNodeSkip from "./nodes/Answers/AnswerNodeSkip.jsx";
import AnswerNodeAccommodations from "./nodes/Answers/AnswerNodeAccommodations";

const nodeTypes = {
	Question: QuestionNode,
	text: AnswerNodeText,
	persons: AnswerNodePeople,
	none: AnswerNodeSkip,
	accommodations: AnswerNodeAccommodations,
};
const selector = (state) => ({
	nodes: state.nodes,
	edges: state.edges,
	onNodesChange: state.onNodesChange,
	onEdgesChange: state.onEdgesChange,
	onConnect: state.onConnect,
});
const ControlsStyled = styled(Controls)`
	button {
		background-color: ${(props) => props.theme.controlsBg};
		color: ${(props) => props.theme.controlsColor};
		border-bottom: 1px solid ${(props) => props.theme.controlsBorder};
		&:hover {
			background-color: ${(props) => props.theme.controlsBgHover};
		}
		path {
			fill: currentColor;
		}
	}
`;

function Flow() {
	const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useStore(
		selector,
		shallow
	);

	return (
		<div className="flow_container">
			<ThemeProvider theme={darkTheme}>
				<ReactFlow
					nodes={nodes}
					edges={edges}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					onConnect={onConnect}
					nodeTypes={nodeTypes}
				>
					<Background />
					<ControlsStyled />
					<MiniMap />
				</ReactFlow>
			</ThemeProvider>
		</div>
	);
}

export default Flow;
