import React, { memo } from "react";
import styled from "styled-components";
import IconArticalQuestion from "../../Icon/IconQuestion/IconArticalQuestion";
import { Handle, useStore as flowStore } from "reactflow";
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
	color: ${(props) => props.theme.questionTextArticle};
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
	color: ${(props) => props.theme.questionTextArticle};
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
	const showContent = flowStore(zoomSelector);
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
				const elseEdges = edges.filter((edge) => edge.type === "edges_else");
				const isHandleFromElseFree = elseEdges.every(
					(edge) => edge.target !== connection.target
				);
				return sourceNode.type.includes("question") && isHandleFromElseFree;
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
				return targetNode.type === "answer_none" && isHandleFree;

			case "IncludeIf":
				return false;
			case "Else":
				const elseEdges = edges.filter((edge) => edge.type === "edges_else");
				const isHandleFromElseFree = elseEdges.every(
					(edge) => edge.source !== connection.source
				);
				return targetNode.type.includes("question") && isHandleFromElseFree;
		}
	};
	if (showContent) {
		if (data.header !== undefined)
			return (
				<Node selected={selected}>
					<Handle
						type="target"
						position="top"
						isValidConnection={isValidConnectionUp}
					/>
					<div>
						<strong>{data.header.sv}</strong>
					</div>
					<IconArticalQuestion />

					<Handle
						type="source"
						position="bottom"
						id="1"
						isValidConnection={isValidConnectionDown}
					></Handle>
				</Node>
			);
		else
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
					<IconArticalQuestion />

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

				<IconArticalQuestion zoomIn />

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
