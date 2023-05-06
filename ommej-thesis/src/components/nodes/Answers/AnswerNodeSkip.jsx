import React, { memo } from "react";
import { Handle, useStore as flowStore } from "reactflow";
import styled from "styled-components";
import IconSkipAnswer from "../../Icon/IconAnswer/IconSkipAnswer";
import useStore from "../../../Store/store";
import { shallow } from "zustand/shallow";
const selector = (state) => ({
	nodes: state.nodes,
	edges: state.edges,
	selectedEdgeType: state.selectedEdgeType,
});
const Node = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	height: 50px;
	width: 50px;
	border-radius: 15px;

	background: ${(props) => props.theme.answerBg};
	color: ${(props) => props.theme.answerSkip};
	border: 1px solid
		${(props) =>
			props.selected ? props.theme.primary : props.theme.nodeBorder};

	.react-flow__handle {
		background: ${(props) => props.theme.handleInputAnswerColor};
		width: 8px;
		height: 10px;
		border: 0px solid #000;
		border-radius: 3px;
	}
`;

const NodeZoomed = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100px;
	width: 100px;
	border-radius: 15px;

	background: ${(props) => props.theme.answerBg};
	color: ${(props) => props.theme.answerSkip};
	border: 8px solid
		${(props) =>
			props.selected ? props.theme.primary : props.theme.nodeBorder};

	.react-flow__handle {
		background: ${(props) => props.theme.handleInputAnswerColor};
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
		switch (selectedEdgeType) {
			case "Default":
				console.log("ss");
				const commonEdges = edges.filter(
					(edge) => edge.type === "edges_new" || edge.type == "edges_custom"
				);
				const isHandleFree = commonEdges.every(
					(edge) =>
						edge.target !== connection.target &&
						edge.source !== connection.source
				);

				return (
					sourceNode.type.includes("question_article_text") && isHandleFree
				);
			case "IncludeIf":
				return false;
			case "Else":
				return false;
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
					(edge) => edge.source !== connection.source
				);
				return targetNode.type.includes("question") && isHandleFree;
			case "IncludeIf":
				return targetNode.type.includes("question");
			case "Else":
				return false;
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
					<IconSkipAnswer />
				</div>
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
				<IconSkipAnswer zoomIn />
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
