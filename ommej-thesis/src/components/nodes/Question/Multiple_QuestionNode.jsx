import React, { memo } from "react";
import { Handle, useStore } from "reactflow";
import styled from "styled-components";
import IconMultiplePersonQuestion from "../../Icon/IconQuestion/IconMultipleQuestion";

const Node = styled.div`
	display: flex;
	column-gap: 40px;
	padding: 20px;
	background: ${(props) => props.theme.questionBg};
	color: ${(props) => props.theme.questionTextMultiple};
	border: 2px solid
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
		width: 13px;
		height: 10px;
		border: 0px solid #000;
		border-radius: 3px;
	}
`;

const zoomSelector = (s) => s.transform[2] >= 0.5;
export default memo(({ data, selected }) => {
	const showContent = useStore(zoomSelector);
	if (showContent) {
		return (
			<Node selected={selected}>
				<Handle type="target" position="top" />
				<div>
					<strong>{data.text.sv}</strong>
				</div>
				<IconMultiplePersonQuestion />

				<Handle type="source" position="bottom" id="1"></Handle>
			</Node>
		);
	} else {
		return (
			<NodeZoomed selected={selected}>
				<Handle type="target" position="top" />

				<IconMultiplePersonQuestion zoomIn />
				<Handle type="source" position="bottom" id="1"></Handle>
			</NodeZoomed>
		);
	}
});
