import React from "react";
import ReactFlow, { MiniMap, Controls, Background,Panel } from "reactflow";
import { shallow } from "zustand/shallow";
import styled, { ThemeProvider } from "styled-components";
import { darkTheme } from "../theme";
import "reactflow/dist/style.css";
import "../css/Flow.css";

import useStore from "../Store/store";

//Question nodes design and presentation
import QuestionNode from "./nodes/Question/QuestionNode.jsx";
import Single_QuestionNode from "./nodes/Question/Single_QuestionNode";
import Persons_QuestionNode from "./nodes/Question/Persons_QuestionNode";
import Article_QuestionNode from "./nodes/Question/Article_QuestionNode";
import Multiple_QuestionNode from "./nodes/Question/Multiple_QuestionNode";
import Frequency_QuestionNode from "./nodes/Question/Frequency_QuestionNode";
import Accommodation_QuestionNode from "./nodes/Question/Accommodation_QuestionNode";
import SingleAccommodation_QuestionNode from "./nodes/Question/SingleAccommodation_QuestionNode";
import SinglePersons from "./nodes/Question/SinglePersons";
import MultiplePersons from "./nodes/Question/MultiplePersons_QuestionNode";

//Answer nodes design and presentation
import AnswerNodeText from "./nodes/Answers/AnswerNodeText.jsx";
import AnswerNodePeople from "./nodes/Answers/AnswerNodePeople.jsx";
import AnswerNodeSkip from "./nodes/Answers/AnswerNodeSkip.jsx";
import AnswerNodeAccommodations from "./nodes/Answers/AnswerNodeAccommodations";

const nodeTypes = {
	Question: QuestionNode,
	//Question Types
	question_single: Single_QuestionNode,
	question_article_text: Article_QuestionNode,	
	question_persons: Persons_QuestionNode,
	question_multiple: Multiple_QuestionNode,
	question_frequency: Frequency_QuestionNode,
	question_accommodations: Accommodation_QuestionNode,
	question_single_accommodation: SingleAccommodation_QuestionNode,
	question_single_person: SinglePersons,
	question_multiple_person: MultiplePersons,

	//Answer Types
	answer_text: AnswerNodeText,
	answer_persons: AnswerNodePeople,
	answer_none: AnswerNodeSkip,
	answer_accommodations: AnswerNodeAccommodations,
};
const selector = (state) => ({
	nodes: state.nodes,
	edges: state.edges,
	onNodesChange: state.onNodesChange,
	onEdgesChange: state.onEdgesChange,
	onConnect: state.onConnect,
	sellected: state.selectedNodes,
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
const PanelsStyled = styled(Panel)`
	background-color: ${(props) => props.theme.panelBg};
	color: ${(props) => props.theme.panelColor};
	border: 1px solid ${(props) => props.theme.panelBorder};
	width: 20%;
	height: 70%;	
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
					<ControlsStyled />
					<MiniMap />
					<PanelsStyled position="top-right"><p>{}</p></PanelsStyled>
				</ReactFlow>
			</ThemeProvider>
		</div>
	);
}

export default Flow;
