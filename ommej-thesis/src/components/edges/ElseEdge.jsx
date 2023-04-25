import React, { memo } from "react";
import { getSmoothStepPath } from "reactflow";
import styled from "styled-components";

export default function CustomEdge({
	id,
	sourceX,
	sourceY,
	targetX,
	targetY,
	sourcePosition,
	targetPosition,
	markerEnd,
	selected,
}) {
	const [edgePath] = getSmoothStepPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
	});

	if (selected) {
		return (
			<>
				<path
					id={id}
					style={{
						stroke: "red",
						strokeWidth: 10,
					}}
					className="react-flow__edge-path"
					d={edgePath}
					markerEnd={markerEnd}
				/>
			</>
		);
	} else {
		return (
			<>
				<path
					id={id}
					style={{
						stroke: "red",
						strokeWidth: 10,
					}}
					className="react-flow__edge-path"
					d={edgePath}
					markerEnd={markerEnd}
				/>
			</>
		);
	}
}
