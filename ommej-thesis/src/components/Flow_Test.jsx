import React from "react";
import ReactFlow, { MiniMap } from "reactflow";
import { shallow } from "zustand/shallow";

import "reactflow/dist/style.css";

import useStore from "../Store/store";
import QuestionNode from "./nodes/Question/QuestionNode.jsx";
const nodeTypes = {
	Question: QuestionNode,
};
const selector = (state) => ({
	nodes: state.nodes,
	edges: state.edges,
	onNodesChange: state.onNodesChange,
	onEdgesChange: state.onEdgesChange,
	onConnect: state.onConnect,
});

function Flow() {
	const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useStore(
		selector,
		shallow
	);

	return (
		<div style={{ height: 500 }}>
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				nodeTypes={nodeTypes}
			/>
		</div>
	);
}

export default Flow;
