import React, { memo } from "react";
import { Handle, useStore as flowStore } from "reactflow";
import styled from "styled-components";
import IconMultiplePersonQuestion from "../../Icon/IconQuestion/IconMultipleQuestion";
import useStore from "../../../Store/store";
import { shallow } from "zustand/shallow";
const selector = (state) => ({
	nodes: state.nodes,
	edges: state.edges,
	selectedEdgeType: state.selectedEdgeType,
});
const Node = styled.div`
	display: flex;
	column-gap: 40px;
	padding: 20px;
	background: ${(props) => props.theme.questionBg};
	color: ${(props) => props.theme.questionTextMultiple};
	border: 5px solid
		${(props) =>
			props.selected ? props.theme.handleInputColor : props.theme.nodeBorder};
	.react-flow__handle {
		background: ${(props) => props.theme.handleInputQuestionColor};
		width: 13px;
		height: 10px;
		border: 0px solid #000;
		border-radius: 3px;
	}
`;

const NodeZoomed = styled.div`
	display: flex;
	column-gap: 40px;
	padding: 20px;
	height: 150px;
	width: 150px;
	align-items: center;
	justify-content: center;
	background: ${(props) => props.theme.questionBg};
	color: ${(props) => props.theme.questionTextMultiple};
	border: 10px solid
		${(props) =>
			props.selected ? props.theme.handleInputColor : props.theme.nodeBorder};
	.react-flow__handle {
		background: ${(props) => props.theme.handleInputQuestionColor};
		width: ${(props) => props.theme.handleWitdh};
		height: 10px;
		border: 0px solid #000;
		border-radius: 3px;
	}
`;

const zoomSelector = (s) => s.transform[2] >= 0.5;
export default memo(({ data, selected }) => {
	const { nodes, edges, selectedEdgeType } = useStore(selector, shallow);

	const isValidConnectionUp = (connection) => {
		const sourceNode = nodes.find((node) => node.id === connection.source);
		const targetNode = nodes.find((node) => node.id === connection.target);

		switch (selectedEdgeType) {
			case "Default":
				const commonEdges = edges.filter(
					(edge) => edge.type === "edges_new" || edge.type == "edges_custom"
				);
				const isHandleFree = commonEdges.every(
					(edge) => edge.source !== connection.source
				);
				return sourceNode.type.includes("answer") && isHandleFree;
			case "IncludeIf":
				return sourceNode.type.includes("answer");
			case "Else":
				return sourceNode.type.includes("question");
		}
	};

	const isValidConnectionDown = (connection) => {
		const targetNode = nodes.find((node) => node.id === connection.target);
		switch (selectedEdgeType) {
			case "Default":
				const commonEdges = edges.filter(
					(edge) => edge.type === "edges_new" || edge.type == "edges_custom"
				);
				const isHandleFree = commonEdges.every(
					(edge) => edge.target !== connection.target
				);
				return targetNode.type === "answer_text" && isHandleFree;
			case "IncludeIf":
				return false;
			case "Else":
				return targetNode.type.includes("question");
		}
	};
	const showContent = flowStore(zoomSelector);
	if (showContent) {
		return (
			<Node selected={selected}>
				<Handle
					type="target"
					position="top"
					isValidConnection={isValidConnectionUp}
				/>
				<div>
					<strong>{data.text.sv}</strong>
				</div>
				<IconMultiplePersonQuestion />

				<Handle
					type="source"
					position="bottom"
					id="1"
					isValidConnection={isValidConnectionDown}
				></Handle>
			</Node>
		);
	} else {
		return (
			<NodeZoomed selected={selected}>
				<Handle
					type="target"
					position="top"
					isValidConnection={isValidConnectionUp}
				/>

				<IconMultiplePersonQuestion zoomIn />
				<Handle
					type="source"
					position="bottom"
					id="1"
					isValidConnection={isValidConnectionDown}
				></Handle>
			</NodeZoomed>
		);
	}
});
