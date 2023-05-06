import { useState, useEffect, useCallback, useRef } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import ReactFlow, {
	SelectionMode,
	MiniMap,
	Controls,
	ReactFlowProvider,
	useKeyPress,
	ControlButton,
} from "reactflow";
import {
	questionTemplate,
	answerTemplate,
	specialQuestionTemplate,
} from "./templates.js";
//Icon for ControlButton
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faForwardFast,
	faBackwardFast,
} from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";

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
import IfEdge from "./edges/IfEdge";
import ElseEdge from "./edges/ElseEdge";
import NewEdge from "./edges/NewEdge";

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
	edges_if: IfEdge,
	edges_else: ElseEdge,
	edges_new: NewEdge,

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
	setShowAddNode: state.setShowAddNode,
	instance: state.reactFlowInstance,
	selectedEdgeType: state.selectedEdgeType,
	undo: state.undo,
	setUndoClearRedo: state.setUndoClearRedo,
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
	const [quantity, setQuantity] = useState(2);
	const [showQuantityModal, setShowQuantityModal] = useState(false);
	const [position, setPosition] = useState({});
	const [type, setType] = useState("");

	const [MiniMapOpen, setMiniMapOpen] = useState(false);
	const mPressed = useKeyPress("m");

	const {
		nodes,
		edges,
		onNodesChange,
		onEdgesChange,
		onConnect,
		onSelectNodes,
		setReactFlowInstance,
		instance,
		setShowAddNode,
		selectedEdgeType,
		undo,
		setUndoClearRedo,
	} = useStore(selector, shallow);

	useEffect(() => {
		if (mPressed) {
			setMiniMapOpen(!MiniMapOpen);
		}
	}, [mPressed]);

	const onFlowInit = (reactFlowInstance) => {
		setReactFlowInstance(reactFlowInstance);
	};
	const handleNodeClick = (event, node) => {
		console.log(node);
		setShowAddNode(false);
		const connectedEdges = edges.filter(
			(el) => el.source === node.id || el.target === node.id
		);
		for (let i = 0; i < connectedEdges.length; i++) {
			connectedEdges[i].selected = true;
		}

		onEdgesChange(connectedEdges);

		for (let i = 0; i < nodes.length; i++) {
			if (nodes[i].id !== node.id) nodes[i].selected = false;
		}

		onNodesChange(nodes);
	};
	const handleEdgeClick = (event, edge) => {
		setShowAddNode(false);
	};
	const onDragOver = useCallback((event) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = "move";
	}, []);

	const onDrop = useCallback(
		(event) => {
			event.preventDefault();
			const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
			const typeFromDrop = event.dataTransfer.getData("application/reactflow");
			const posFromDrop = instance.project({
				x: event.clientX - reactFlowBounds.left,
				y: event.clientY - reactFlowBounds.top,
			});
			setType(typeFromDrop);
			setQuantity(2);
			setPosition(posFromDrop);
			const newUndo = [];

			if (
				typeFromDrop === "question_accommodations" ||
				typeFromDrop === "question_article_text" ||
				typeFromDrop === "question_persons"
			) {
				const [newNodes, newEdges] = specialQuestionTemplate(
					typeFromDrop,
					posFromDrop
				);
				newUndo.push({
					action: "add",
					nodes: _.cloneDeep(newNodes),
					edges: _.cloneDeep(newEdges),
				});
				instance.addNodes(newNodes);
				instance.addEdges(newEdges);
				setUndoClearRedo([...undo, newUndo]);
			} else if (
				typeFromDrop !== "answer_text" &&
				!typeFromDrop.includes("question")
			) {
				const newNode = answerTemplate(typeFromDrop, posFromDrop, 1);
				newUndo.push({
					action: "add",
					nodes: _.cloneDeep(newNode),
					edges: [],
				});
				instance.addNodes(newNode);
			} else setShowQuantityModal(true);
		},
		[instance, undo]
	);
	const addNodes = () => {
		const newUndo = [];

		if (type.includes("question")) {
			const [newNodes, newEdges] = questionTemplate(type, position, quantity);
			newUndo.push({
				action: "add",
				nodes: _.cloneDeep(newNodes),
				edges: _.cloneDeep(newEdges),
			});
			instance.addNodes(newNodes);
			instance.addEdges(newEdges);
		} else {
			const newNode = answerTemplate(type, position, quantity);
			newUndo.push({
				action: "add",
				nodes: _.cloneDeep(newNode),
				edges: [],
			});
			instance.addNodes(newNode);
		}
		setUndoClearRedo([...undo, newUndo]);
		handleClose();
	};
	const handleClose = () => setShowQuantityModal(false);

	const onEdgeConnect = useCallback(
		(edge) => {
			const newUndo = [];
			newUndo.push({
				action: "add",
				nodes: [],
				edges: [edge],
			});
			const sourceNode = nodes.find((node) => node.id === edge.source);
			const targetNode = nodes.find((node) => node.id === edge.target);
			const oldStateSource = _.cloneDeep(sourceNode);
			const oldStateTarget = _.cloneDeep(targetNode);
			switch (selectedEdgeType) {
				case "Default":
					if (sourceNode.type.includes("question")) {
						sourceNode.data.answers[targetNode.id] = targetNode.data;
						edge.id = "fromQ " + sourceNode.id + " " + targetNode.id;
					} else {
						edge.id = "fromA " + sourceNode.id + " " + targetNode.id;

						const edgeFromQuestion = edges.find(
							(edge) => edge.target === sourceNode.id
						);
						if (edgeFromQuestion !== undefined) {
							const questionWithAnswer = nodes.find(
								(node) => node.id === edgeFromQuestion.source
							);
							questionWithAnswer.data.answers[sourceNode.id].next =
								targetNode.id;
						} else {
							sourceNode.data.next = targetNode.id;
						}
					}
					edge.type = "edges_new";
					onConnect(edge);
					break;
				case "IncludeIf":
					if (targetNode.data.includeIf !== undefined) {
						if (!targetNode.data.includeIf.answers.includes(sourceNode.id))
							targetNode.data.includeIf.answers.push(sourceNode.id);
					} else {
						targetNode.data.includeIf = { answers: [sourceNode.id] };
					}
					edge.id = "if " + sourceNode.id + " " + targetNode.id;

					edge.type = "edges_if";
					onConnect(edge);
					break;
				case "Else":
					if (sourceNode.data.includeIf !== undefined) {
						sourceNode.data.includeIf.else = targetNode.id;
					} else {
						sourceNode.data.includeIf = { else: targetNode.id };
					}
					edge.id = "else " + sourceNode.id + " " + targetNode.id;

					edge.type = "edges_else";
					onConnect(edge);
					break;
			}
			const newStateSource = _.cloneDeep(sourceNode);
			const newStateTarget = _.cloneDeep(targetNode);
			newUndo.push({
				action: "modify",
				oldState: oldStateSource,
				newState: newStateSource,
			});
			newUndo.push({
				action: "modify",
				oldState: oldStateTarget,
				newState: newStateTarget,
			});
			setUndoClearRedo([...undo, newUndo]);
		},
		[nodes, edges, selectedEdgeType, undo]
	);
	function handleDefualt(e) {
		e.preventDefault();
	}
	return (
		<div className="flow_container">
			<ThemeProvider theme={darkTheme}>
				<ReactFlowProvider>
					<div className="reactflow-wrapper" ref={reactFlowWrapper}>
						<ReactFlow
							onInit={onFlowInit}
							nodes={nodes}
							edges={edges}
							onConnect={onEdgeConnect}
							onNodesChange={onNodesChange}
							onEdgesChange={onEdgesChange}
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
							elevateEdgesOnSelect={true}
							panOnDrag={[2]}
							deleteKeyCode={null}
							panActivationKeyCode={null}
							multiSelectionKeyCode={null}
							selectionKeyCode={null}
							zoomOnScroll={false}
							zoomActivationKeyCode={"Alt"}
							onNodeClick={handleNodeClick}
							onEdgeClick={handleEdgeClick}
							onNodeDrag={handleNodeClick}
							onDragOver={onDragOver}
							onDrop={onDrop}
						>
							<ControlsStyled>
								<ControlButton
									onClick={() => {
										const lowestNode = nodes.reduce((lowest, node) => {
											if (node.position.y < lowest.position.y) {
												return node;
											} else {
												return lowest;
											}
										});
										instance.setCenter(
											lowestNode.position.x,
											lowestNode.position.y + 3000,
											{
												zoom: 0.1,
											}
										);
									}}
								>
									<FontAwesomeIcon icon={faBackwardFast} />
								</ControlButton>
								<ControlButton
									onClick={() => {
										const highestNode = nodes.reduce((highest, node) => {
											if (node.position.y > highest.position.y) {
												return node;
											} else {
												return highest;
											}
										});
										instance.setCenter(
											highestNode.position.x,
											highestNode.position.y - 3000,
											{
												zoom: 0.1,
											}
										);
									}}
								>
									<FontAwesomeIcon icon={faForwardFast} />
								</ControlButton>
							</ControlsStyled>
							{MiniMapOpen && (
								<MiniMapStyled
									zoomable
									position="top-left"
									nodeColor="rgb(255,0,0)"
									maskColor="rgb(255,255,255,.1)"
									style={{
										background: "rgb(10,10,10,1)",
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

			<Modal show={showQuantityModal} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>How many answers do you need?</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={(e) => handleDefualt(e)}>
						<Form.Select
							value={quantity}
							onChange={(event) => {
								setQuantity(event.target.value);
							}}
						>
							{[...Array(50)].map((_, index) => (
								<option key={index + 1}>{index + 1}</option>
							))}
						</Form.Select>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Cancel
					</Button>
					<Button variant="primary" onClick={addNodes}>
						Ok
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
}

export default Flow;
