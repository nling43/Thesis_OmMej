import React, { memo } from "react";
import { Handle, useStore as flowStore } from "reactflow";
import styled from "styled-components";
import IconText from "../../Icon/IconAnswer/IconTextAnswer";
import useStore from "../../../Store/store";
import { shallow } from "zustand/shallow";
const selector = (state) => ({
	nodes: state.nodes,
	edges: state.edges,
	selectedEdgeType: state.selectedEdgeType,
});
const Node = styled.div`
	display: flex;
	gap: 20px;
	height: auto;
	width: auto;
	max-width: 150px;
	border-radius: 15px;
	padding: 3px 6px;
	text-align: center;
	align-items: center;
	justify-content: center;

	background: ${(props) => props.theme.answerBg};
	color: ${(props) => props.theme.answerText};

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
	gap: 20px;
	height: 100px;
	width: 100px;
	max-width: 150px;
	border-radius: 15px;
	padding: 3px 6px;
	text-align: center;
	align-items: center;
	justify-content: center;

	background: ${(props) => props.theme.answerBg};
	color: ${(props) => props.theme.answerText};

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
		console.log(sourceNode);
		const isHandleFree = edges.every(
			(edge) => edge.target !== connection.target
		);
		return sourceNode.type.includes("question") && isHandleFree;
	};

	const isValidConnectionDown = (connection) => {
		const targetNode = nodes.find((node) => node.id === connection.target);
		console.log(targetNode);
		const isHandleFree = edges.every(
			(edge) => edge.source !== connection.source
		);
		return targetNode.type.includes("question") && isHandleFree;
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
					<IconText />
				</div>
				<div>
					<strong>{data.text.sv}</strong>
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
				<div>
					<IconText zoomIn />
				</div>
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
