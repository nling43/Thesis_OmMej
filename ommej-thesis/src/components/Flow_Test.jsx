import { useState, useEffect, useCallback, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import ReactFlow, {
	SelectionMode,
	MiniMap,
	Controls,
	ReactFlowProvider,
	useKeyPress,
	ControlButton,
} from "reactflow";
//Icon for ControlButton
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faForwardFast,
	faBackwardFast,
} from "@fortawesome/free-solid-svg-icons";

import { shallow } from "zustand/shallow";
import styled, { ThemeProvider } from "styled-components";
import { darkTheme } from "../theme";
import "reactflow/dist/style.css";
import "../css/Flow.css";
import useStore from "../Store/store";
import { SideBar } from "./sidebar/sideBar.jsx";
//Question nodes design and presentation
import Single_QuestionNode from "./nodes/Question/Single_QuestionNode";
import Persons_QuestionNode from "./nodes/Question/Persons_QuestionNode";
import Article_QuestionNode from "./nodes/Question/Article_QuestionNode";
import Multiple_QuestionNode from "./nodes/Question/Multiple_QuestionNode";
import Frequency_QuestionNode from "./nodes/Question/Frequency_QuestionNode";
import Accommodation_QuestionNode from "./nodes/Question/Accommodation_QuestionNode";
import SingleAccommodation_QuestionNode from "./nodes/Question/SingleAccommodation_QuestionNode";
import SinglePersons from "./nodes/Question/SinglePersons_QuestionNode";
import MultiplePersons from "./nodes/Question/MultiplePersons_QuestionNode";

//Answer nodes design and presentation
import AnswerNodeText from "./nodes/Answers/AnswerNodeText.jsx";
import AnswerNodePeople from "./nodes/Answers/AnswerNodePeople.jsx";
import AnswerNodeSkip from "./nodes/Answers/AnswerNodeSkip.jsx";
import AnswerNodeAccommodations from "./nodes/Answers/AnswerNodeAccommodations";

//Edge design and presentation
import CustomEdge from "./edges/CustomEdge";
const nodeTypes = {
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

const edgeTypes = {
	edges_custom: CustomEdge,
	//Edge Types
	//edge_single: Single_QuestionEdges,
	//edge_article_text
	//edge_persons
	//edge_multiple
	//edge_frequency
	//edge_accommodations
	//edge_single_accommodation
	//edge_single_person
	//edge_multiple_person
};

const selector = (state) => ({
	nodes: state.nodes,
	edges: state.edges,
	onNodesChange: state.onNodesChange,
	onEdgesChange: state.onEdgesChange,
	onConnect: state.onConnect,
	selected: state.selectedNodes,
	onSelectNodes: state.onSelectNodes,
	setReactFlowInstance: state.setReactFlowInstance,
	onViewPortChange: state.onViewPortChange,
	instance: state.reactFlowInstance,
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
const MiniMapStyled = styled(MiniMap)`
	.react-flow__minimap {
		border: 1px solid ${(props) => props.theme.minimapBorder};
	}
`;

function Flow() {
	const reactFlowWrapper = useRef(null);

	const [MiniMapOpen, setMiniMapOpen] = useState(false);
	const mPressed = useKeyPress("m");
	useEffect(() => {
		if (mPressed) {
			setMiniMapOpen(!MiniMapOpen);
		}
	}, [mPressed]);
	const {
		nodes,
		edges,
		onNodesChange,
		onEdgesChange,
		onConnect,
		onSelectNodes,
		setReactFlowInstance,
		instance,
	} = useStore(selector, shallow);
	const onFlowInit = (reactFlowInstance) => {
		setReactFlowInstance(reactFlowInstance);
	};
	const handleNodeClick = (event, node) => {
		nodes.forEach((element) => {
			if (element.id !== node.id) element.selected = false;
		});
		onNodesChange(nodes);
	};

	const onDragOver = useCallback((event) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = "move";
	}, []);

	const onDrop = useCallback(
		(event) => {
			event.preventDefault();

			const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
			const type = event.dataTransfer.getData("application/reactflow");
			console.log(reactFlowBounds);
			// check if the dropped element is valid
			if (typeof type === "undefined" || !type) {
				return;
			}

			const position = instance.project({
				x: event.clientX - reactFlowBounds.left,
				y: event.clientY - reactFlowBounds.top,
			});
			console.log(position);
			const newNode = {
				id: uuidv4(),
				type,
				position,
				data: {},
			};
			console.log(newNode);
			instance.addNodes(newNode);
		},
		[instance]
	);

	return (
		<div className="flow_container">
			<ThemeProvider theme={darkTheme}>
				<ReactFlowProvider>
					<div className="reactflow-wrapper" ref={reactFlowWrapper}>
						<ReactFlow
							onInit={onFlowInit}
							nodes={nodes}
							edges={edges}
							onNodesChange={onNodesChange}
							onEdgesChange={onEdgesChange}
							onConnect={onConnect}
							nodeTypes={nodeTypes}
							edgeTypes={edgeTypes}
							onSelectionChange={onSelectNodes}
							panOnScroll={true}
							minZoom={0.05}
							maxZoom={1}
							defaultViewport={{ x: 0, y: 0, zoom: 0.1 }}
							onlyRenderVisibleElements={true}
							selectionOnDrag={true}
							selectionMode={SelectionMode.Partial}
							panOnDrag={[2]}
							deleteKeyCode={null}
							panActivationKeyCode={null}
							multiSelectionKeyCode={null}
							selectionKeyCode={null}
							zoomOnScroll={false}
							zoomActivationKeyCode={"Alt"}
							onNodeClick={handleNodeClick}
							onDragOver={onDragOver}
							onDrop={onDrop}
						>
							<ControlsStyled>
								<ControlButton
									onClick={() => {
										console.log(nodes[0].position);
										instance.setCenter(
											nodes[0].position.x,
											nodes[0].position.y,
											{
												zoom: 0.1,
											}
										);
									}}
								>
									<FontAwesomeIcon icon={faForwardFast} />
								</ControlButton>
								<ControlButton
									onClick={() => {
										console.log(nodes[nodes.length - 1].position);
										instance.setCenter(
											nodes[nodes.length - 1].position.x,
											nodes[nodes.length - 1].position.y,
											{
												zoom: 0.1,
											}
										);
									}}
								>
									<FontAwesomeIcon icon={faBackwardFast} />
								</ControlButton>
							</ControlsStyled>
							{MiniMapOpen && (
								<MiniMapStyled
									position="top-left"
									nodeColor="rgb(255,0,0)"
									maskColor="rgb(0,0,0,.1)"
									style={{
										background: "rgb(255,255,255,0.9)",
										margin: 0,
										height: 680,
										width: 300,
									}}
								/>
							)}

							<SideBar />
						</ReactFlow>
					</div>
				</ReactFlowProvider>
			</ThemeProvider>
		</div>
	);
}

export default Flow;
