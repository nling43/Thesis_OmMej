import React, { memo } from "react";
import { Handle } from "reactflow";
import styled from "styled-components";

const Node = styled.div`
	padding: 3px 3px;
		font-size: 0.5rem:

	border-radius: 200px;
	background: ${(props) => props.theme.answerBg};
	color: ${(props) => props.theme.nodeColor};
	border: 2px solid
		${(props) =>
			props.selected ? props.theme.handleInputColor : props.theme.nodeBorder};
	.react-flow__handle {
		background: ${(props) => props.theme.handleInputColor};
		width: 8px;
		height: 10px;
		border: 0px solid #000;
		border-radius: 3px;
	}
`;

export default memo(({ data, selected }) => {
	return (
		<Node selected={selected}>
			<Handle type="target" position="top" style={{ width: 13 }} />
			<div>
				<strong>{data.text.sv}</strong>
			</div>
			<Handle type="source" position="bottom" id="1"></Handle>
		</Node>
	);
});
