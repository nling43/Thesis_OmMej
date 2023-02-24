import ReactFlow, {
	addEdge,
	FitViewOptions,
	applyNodeChanges,
	applyEdgeChanges,
	Node,
	Edge,
	NodeChange,
	EdgeChange,
	Connection,
	Background,
	Controls,
	Panel,
} from "reactflow";
import styled, { ThemeProvider } from "styled-components";
import { darkTheme } from "../theme";
import "../css/Flow.css";

import "reactflow/dist/style.css";
import { useState, useEffect, useCallback } from "react";
import QuestionNode from "./nodes/Question/QuestionNode.jsx";
import AnswerNodeText from "./nodes/Answers/AnswerNodeText.jsx";
import AnswerNodeSkip from "./nodes/Answers/AnswerNodeSkip";
import AnswerNodePeople from "./nodes/Answers/AnswerNodePeople.jsx";

function getWindowDimensions() {
	const { innerWidth: width, innerHeight: height } = window;

	return {
		width,
		height,
	};
}

function useWindowDimensions() {
	const [windowDimensions, setWindowDimensions] = useState(
		getWindowDimensions()
	);

	useEffect(() => {
		function handleResize() {
			setWindowDimensions(getWindowDimensions());
		}

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return windowDimensions;
}

const nodeTypes = {
	Question: QuestionNode,
	AnswerText: AnswerNodeText,
	AnswerPeople: AnswerNodePeople,
	AnswerSkip: AnswerNodeSkip,
};

const initialEdges = [
	{ id: "1-2", source: "1", target: "2" },
	{ id: "1-3", source: "1", target: "3" },
];

const start_nodes = [
	{
		id: "1",
		data: {
			text: { sv: "Question 1" },
			type: "",
			tags: [""],
			old: "",
			ref: "",
			video: "",
			includeIf: {
				answers: [],
				else: [],
			},
		},
		type: "Question",
		position: { x: 500, y: 50 },
	},
	{
		id: "2",
		data: {
			type: "text",
			tags: [""],
			text: {
				sv: "answerText",
			},
			alarm: "",
			next: "",
		},
		type: "AnswerText",
		position: { x: 500, y: 350 },
	},

	{
		id: "3",
		data: {
			type: "persons",
			tags: [""],
			text: {},
			alarm: "",
			next: "",
		},
		type: "AnswerPeople",
		position: { x: 800, y: 350 },
	},
	{
		id: "4",
		data: {
			type: "none",
			tags: [""],
			text: {},
			alarm: "",
			next: "",
		},
		type: "AnswerSkip",
		position: { x: 100, y: 350 },
	},
];
const ReactFlowStyled = styled(ReactFlow)`
	background-color: ${(props) => props.theme.bg};
`;

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
	const { height, width } = useWindowDimensions();
	const [nodes, setNodes] = useState(start_nodes);
	const [edges, setEdges] = useState(initialEdges);

	const onNodesChange = useCallback(
		(changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
		[]
	);
	const onEdgesChange = useCallback(
		(changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
		[]
	);
	const onConnect = useCallback(
		(params) => setEdges((eds) => addEdge(params, eds)),
		[]
	);
	return (
		<div style={{ height: height - 65 }}>
			<ThemeProvider theme={darkTheme}>
				<ReactFlowStyled
					nodes={nodes}
					onNodesChange={onNodesChange}
					edges={edges}
					onEdgesChange={onEdgesChange}
					onConnect={onConnect}
					nodeTypes={nodeTypes}
				>
					<Background />
					<ControlsStyled />
				</ReactFlowStyled>
			</ThemeProvider>
		</div>
	);
}

export default Flow;
